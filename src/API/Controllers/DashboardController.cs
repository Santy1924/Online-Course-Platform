using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ICourseService _courseService;

    public DashboardController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics()
    {
        var metrics = await _courseService.GetDashboardMetricsAsync();
        return Ok(metrics);
    }
}
