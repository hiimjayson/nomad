import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nomad_app/blocs/auth/auth_bloc.dart';
import 'package:nomad_app/screens/auth/phone_auth_screen.dart';
import 'package:nomad_app/screens/map/map_screen.dart';
import 'package:nomad_app/services/auth/auth_service.dart';
import 'package:nomad_app/core/theme/app_colors.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_naver_map/flutter_naver_map.dart';

void main() async {
  await dotenv.load(fileName: ".env");

  await NaverMapSdk.instance
      .initialize(clientId: dotenv.env['NAVER_MAP_CLIENT_ID']!);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          AuthBloc(authService: authService)..add(AuthCheckRequested()),
      child: MaterialApp(
        title: 'Nomad',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            primary: AppColors.primary,
          ),
          useMaterial3: true,
          fontFamily: 'Pretendard',
        ),
        home: const AuthenticationWrapper(),
      ),
    );
  }
}

class AuthenticationWrapper extends StatelessWidget {
  const AuthenticationWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if (state is AuthLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (state is Authenticated) {
          return const MapScreen();
        }

        return const PhoneAuthScreen();
      },
    );
  }
}
