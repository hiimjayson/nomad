import 'package:flutter/material.dart';
import 'package:nomad_app/screens/auth/phone_auth_screen.dart';
import 'package:nomad_app/core/theme/app_colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nomad',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          primary: AppColors.primary,
        ),
        useMaterial3: true,
        fontFamily: 'Pretendard',
      ),
      home: const PhoneAuthScreen(),
    );
  }
}
