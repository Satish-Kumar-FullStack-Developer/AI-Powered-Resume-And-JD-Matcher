"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
/**
 * API Response Utility Class
 */
class ApiResponse {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            statusCode,
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }
    static error(message = 'Internal Server Error', statusCode = 500, error) {
        return {
            statusCode,
            success: false,
            message,
            error: process.env.NODE_ENV === 'production' ? undefined : error,
            timestamp: new Date().toISOString(),
        };
    }
    static paginated(data, page, limit, total, message = 'Success') {
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
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiResponse.js.map