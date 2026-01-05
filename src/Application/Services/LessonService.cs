using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepository;
    private readonly ICourseRepository _courseRepository;

    public LessonService(ILessonRepository lessonRepository, ICourseRepository courseRepository)
    {
        _lessonRepository = lessonRepository;
        _courseRepository = courseRepository;
    }

    public async Task<IEnumerable<LessonDto>> GetByCourseIdAsync(Guid courseId)
    {
        var lessons = await _lessonRepository.GetByCourseIdAsync(courseId);
        return lessons.Select(l => new LessonDto
        {
            Id = l.Id,
            CourseId = l.CourseId,
            Title = l.Title,
            Order = l.Order,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt
        });
    }

    public async Task<LessonDto?> GetByIdAsync(Guid id)
    {
        var lesson = await _lessonRepository.GetByIdAsync(id);
        if (lesson == null) return null;

        return new LessonDto
        {
            Id = lesson.Id,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Order = lesson.Order,
            CreatedAt = lesson.CreatedAt,
            UpdatedAt = lesson.UpdatedAt
        };
    }

    public async Task<LessonDto> CreateAsync(CreateLessonDto dto)
    {
        var course = await _courseRepository.GetByIdAsync(dto.CourseId);
        if (course == null) throw new KeyNotFoundException("Course not found");

        // Ensure unique order
        if (!await _lessonRepository.IsOrderUniqueAsync(dto.CourseId, dto.Order))
        {
            // If order exists, maybe shift others or throw?
            // Requirement says "Order field must be unique".
            // Let's assume we throw for now, or auto-increment if not provided (but it is provided).
            throw new InvalidOperationException($"Lesson with order {dto.Order} already exists in this course.");
        }

        var lesson = new Lesson
        {
            Id = Guid.NewGuid(),
            CourseId = dto.CourseId,
            Title = dto.Title,
            Order = dto.Order,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _lessonRepository.AddAsync(lesson);

        // Update course last modification date
        course.UpdatedAt = DateTime.UtcNow;
        await _courseRepository.UpdateAsync(course);

        return new LessonDto
        {
            Id = lesson.Id,
            CourseId = lesson.CourseId,
            Title = lesson.Title,
            Order = lesson.Order,
            CreatedAt = lesson.CreatedAt,
            UpdatedAt = lesson.UpdatedAt
        };
    }

    public async Task UpdateAsync(Guid id, UpdateLessonDto dto)
    {
        var lesson = await _lessonRepository.GetByIdAsync(id);
        if (lesson == null) throw new KeyNotFoundException("Lesson not found");

        if (lesson.Order != dto.Order)
        {
             if (!await _lessonRepository.IsOrderUniqueAsync(lesson.CourseId, dto.Order))
            {
                throw new InvalidOperationException($"Lesson with order {dto.Order} already exists in this course.");
            }
        }

        lesson.Title = dto.Title;
        lesson.Order = dto.Order;
        await _lessonRepository.UpdateAsync(lesson);

        // Update course last modification date
        var course = await _courseRepository.GetByIdAsync(lesson.CourseId);
        if (course != null)
        {
            await _courseRepository.UpdateAsync(course);
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var lesson = await _lessonRepository.GetByIdAsync(id);
        if (lesson == null) throw new KeyNotFoundException("Lesson not found");

        await _lessonRepository.DeleteAsync(lesson);

        // Update course last modification date
        var course = await _courseRepository.GetByIdAsync(lesson.CourseId);
        if (course != null)
        {
            await _courseRepository.UpdateAsync(course);
        }
    }

    public async Task ReorderAsync(Guid courseId, List<Guid> newOrder)
    {
        var lessons = (await _lessonRepository.GetByCourseIdAsync(courseId)).ToList();
        
        if (lessons.Count != newOrder.Count)
        {
             throw new InvalidOperationException("Lesson count mismatch for reordering.");
        }

        // Validate that all IDs belong to the course
        if (newOrder.Any(id => !lessons.Any(l => l.Id == id)))
        {
             throw new InvalidOperationException("Invalid lesson IDs provided.");
        }

        // Update orders
        for (int i = 0; i < newOrder.Count; i++)
        {
            var lesson = lessons.First(l => l.Id == newOrder[i]);
            lesson.Order = i + 1; // 1-based order
            await _lessonRepository.UpdateAsync(lesson);
        }

        // Update course last modification date
        var courseToUpdate = await _courseRepository.GetByIdAsync(courseId);
        if (courseToUpdate != null)
        {
            await _courseRepository.UpdateAsync(courseToUpdate);
        }
    }
}
