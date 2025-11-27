/**
 * API Response Utility Class
 */
export declare class ApiResponse {
    static success(data: unknown, message?: string, statusCode?: number): {
        statusCode: number;
        success: boolean;
        message: string;
        data: unknown;
        timestamp: string;
    };
    static error(message?: string, statusCode?: number, error?: unknown): {
        statusCode: number;
        success: boolean;
        message: string;
        error: unknown;
        timestamp: string;
    };
    static paginated(data: unknown[], page: number, limit: number, total: number, message?: string): {
        statusCode: number;
        success: boolean;
        message: string;
        data: unknown[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        timestamp: string;
    };
}
//# sourceMappingURL=apiResponse.d.ts.map