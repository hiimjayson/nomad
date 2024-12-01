import 'package:dio/dio.dart';
import './types.dart';

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

  Future<VerificationResponse> verifyCode(
      String phoneNumber, String code) async {
    try {
      final response = await _dio.post(
        '/auth/verify-code',
        data: {
          'phoneNumber': phoneNumber,
          'code': code,
        },
      );
      return VerificationResponse.fromJson(response.data);
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
