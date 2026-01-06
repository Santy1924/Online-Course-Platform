namespace Application.DTOs;

public class DashboardMetricsDto
{
    public int TotalCourses { get; set; }
    public int PublishedCourses { get; set; }
    public int DraftCourses { get; set; }
    public int TotalLessons { get; set; }
    public int TotalUsers { get; set; } // For future use
}
