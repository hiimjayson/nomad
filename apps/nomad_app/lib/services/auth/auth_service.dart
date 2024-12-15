import 'package:dio/dio.dart';
import './types.dart';
import './token_storage.dart';

class AuthService {
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3000/api',
  );

  final Dio _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    contentType: 'application/json',
  ));

  Future<VerificationResponse> sendVerification(String phoneNumber) async {
    try {
      final response = await _dio.post(
        '/auth/send-verification',
        data: {'phoneNumber': phoneNumber},
      );
      return VerificationResponse.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<VerifyCodeResponse> verifyCode(String phoneNumber, String code) async {
    try {
      final response = await _dio.post(
        '/auth/verify-code',
        data: {
          'phoneNumber': phoneNumber,
          'code': code,
        },
      );
      final result = VerifyCodeResponse.fromJson(response.data);

      // 토큰 저장
      await TokenStorage.saveTokens(
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      );

      return result;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<TokenResponse> refreshToken() async {
    try {
      final refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken == null) {
        throw Exception('리프레시 토큰이 없습니다.');
      }

      final response = await _dio.post(
        '/auth/refresh',
        options: Options(
          headers: {'Authorization': 'Bearer $refreshToken'},
        ),
      );

      final result = TokenResponse.fromJson(response.data);

      // 새로운 토큰 저장
      await TokenStorage.saveTokens(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );

      return result;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Exception _handleDioError(DioException e) {
    if (e.response?.data != null && e.response?.data['message'] != null) {
      return Exception(e.response?.data['message']);
    }
    return Exception('네트워크 오류가 발생했습니다.');
  }
}

final authService = AuthService();

// 응답 타입 정의 추가
class VerifyCodeResponse {
  final bool isNew;
  final User user;
  final Tokens tokens;

  VerifyCodeResponse({
    required this.isNew,
    required this.user,
    required this.tokens,
  });

  factory VerifyCodeResponse.fromJson(Map<String, dynamic> json) {
    return VerifyCodeResponse(
      isNew: json['isNew'] as bool,
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      tokens: Tokens.fromJson(json['tokens'] as Map<String, dynamic>),
    );
  }
}

class User {
  final String uid;

  User({required this.uid});

  factory User.fromJson(json) {
    return User(uid: json['uid'] as String);
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

class TokenResponse {
  final String accessToken;
  final String refreshToken;
  final String uid;

  TokenResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.uid,
  });

  factory TokenResponse.fromJson(json) {
    return TokenResponse(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      uid: json['uid'] as String,
    );
  }
}
