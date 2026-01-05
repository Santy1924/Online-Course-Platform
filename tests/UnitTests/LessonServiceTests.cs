using Application.DTOs;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using Moq;
using Xunit;

namespace UnitTests;

public class LessonServiceTests
{
    private readonly Mock<ILessonRepository> _lessonRepositoryMock;
    private readonly Mock<ICourseRepository> _courseRepositoryMock;
    private readonly LessonService _lessonService;

    public LessonServiceTests()
    {
        _lessonRepositoryMock = new Mock<ILessonRepository>();
        _courseRepositoryMock = new Mock<ICourseRepository>();
        _lessonService = new LessonService(_lessonRepositoryMock.Object, _courseRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateLesson_WithUniqueOrder_ShouldSucceed()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var dto = new CreateLessonDto { CourseId = courseId, Title = "New Lesson", Order = 1 };
        
        _courseRepositoryMock.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(new Course { Id = courseId });
        _lessonRepositoryMock.Setup(r => r.IsOrderUniqueAsync(courseId, dto.Order)).ReturnsAsync(true);

        // Act
        var result = await _lessonService.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Title, result.Title);
        _lessonRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Lesson>()), Times.Once);
    }

    [Fact]
    public async Task CreateLesson_WithDuplicateOrder_ShouldFail()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var dto = new CreateLessonDto { CourseId = courseId, Title = "Duplicate Lesson", Order = 1 };

        _courseRepositoryMock.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(new Course { Id = courseId });
        _lessonRepositoryMock.Setup(r => r.IsOrderUniqueAsync(courseId, dto.Order)).ReturnsAsync(false); // Duplicate

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _lessonService.CreateAsync(dto));
    }
}
