using Domain.Enums;

namespace Domain.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public CourseStatus Status { get; set; } = CourseStatus.Draft;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
