interface WebRequest {
    type: "request" | "exec" | "action",
    data: any,
    args: any
}