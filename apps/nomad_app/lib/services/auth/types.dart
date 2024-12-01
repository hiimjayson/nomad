class VerificationResponse {
  final String message;

  VerificationResponse({required this.message});

  factory VerificationResponse.fromJson(Map<String, dynamic> json) {
    return VerificationResponse(message: json['message'] as String);
  }
}
