class User {
  final String uid;
  final String phoneNumber;
  final bool isTester;

  User({required this.uid, required this.phoneNumber, required this.isTester});

  factory User.fromJson(json) {
    return User(
      uid: json['uid'] as String,
      phoneNumber: json['phoneNumber'] as String,
      isTester: json['isTester'] as bool,
    );
  }
}

class Tokens {
  final String accessToken;
  final String refreshToken;

  Tokens({required this.accessToken, required this.refreshToken});

  factory Tokens.fromJson(json) {
    return Tokens(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
    );
  }
}

class VerificationResponse {
  final String message;
  final String code;
  final User? user;
  final Tokens? tokens;

  VerificationResponse({
    required this.message,
    required this.code,
    this.user,
    this.tokens,
  });

  factory VerificationResponse.fromJson(Map<String, dynamic> json) {
    return VerificationResponse(
      message: json['message'] as String,
      code: json['code'] as String,
      user: json['result']['user'] != null
          ? User.fromJson(json['result']['user'])
          : null,
      tokens: json['result']['tokens'] != null
          ? Tokens.fromJson(json['result']['tokens'])
          : null,
    );
  }
}
