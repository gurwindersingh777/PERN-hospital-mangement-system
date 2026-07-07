export class ApiResponse<T> {
  constructor(
    public statusCode: number,
    public data: T,
    public message = "Success",
    public success = true
  ) {}
}
