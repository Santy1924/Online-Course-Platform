using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<IEnumerable<CourseDto>> GetAllAsync(string? search, CourseStatus? status, int page, int pageSize)
    {
        var courses = await _courseRepository.GetAllAsync(search, status, page, pageSize);
        return courses.Select(c => new CourseDto
        {
            Id = c.Id,
            Title = c.Title,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            LessonCount = c.Lessons.Count(l => !l.IsDeleted)
        });
    }

    public async Task<CourseDto?> GetByIdAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return null;

        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Status = course.Status,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt,
            LessonCount = course.Lessons.Count(l => !l.IsDeleted)
        };
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto)
    {
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Status = CourseStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _courseRepository.AddAsync(course);

        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Status = course.Status,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt,
            LessonCount = 0
        };
    }

    public async Task UpdateAsync(Guid id, UpdateCourseDto dto)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) throw new KeyNotFoundException("Course not found");

        course.Title = dto.Title;
        await _courseRepository.UpdateAsync(course);
    }

    public async Task DeleteAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) throw new KeyNotFoundException("Course not found");

        await _courseRepository.DeleteAsync(course);
    }

    public async Task PublishAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) throw new KeyNotFoundException("Course not found");

        if (course.Lessons.Count(l => !l.IsDeleted) == 0)
        {
            throw new InvalidOperationException("Cannot publish a course with no active lessons.");
        }

        course.Status = CourseStatus.Published;
        await _courseRepository.UpdateAsync(course);
    }

    public async Task UnpublishAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) throw new KeyNotFoundException("Course not found");

        course.Status = CourseStatus.Draft;
        await _courseRepository.UpdateAsync(course);
    }

    public async Task<object> GetSummaryAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) throw new KeyNotFoundException("Course not found");

        return new
        {
            Id = course.Id,
            Title = course.Title,
            TotalLessons = course.Lessons.Count(l => !l.IsDeleted),
            LastModified = course.UpdatedAt
        };
    }
}
