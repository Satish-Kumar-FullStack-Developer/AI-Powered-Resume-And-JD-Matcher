/**
 * API Response Utility Class
 */
export class ApiResponse {
  static success(data: unknown, message: string = 'Success', statusCode: number = 200) {
    return {
      statusCode,
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: unknown
  ) {
    return {
      statusCode,
      success: false,
      message,
      error: process.env.NODE_ENV === 'production' ? undefined : error,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(
    data: unknown[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ) {
    return {
      statusCode: 200,
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
