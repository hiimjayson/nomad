import 'package:flutter/material.dart';
import 'package:nomad_app/core/theme/app_colors.dart';
import 'package:nomad_app/components/ui/button.dart';
import 'package:nomad_app/components/ui/pin_code_field.dart';
import 'package:nomad_app/services/auth/auth_service.dart';
import 'package:nomad_app/screens/map/map_screen.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/auth/auth_bloc.dart';

class VerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const VerificationScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final _codeController = TextEditingController();
  bool _isValid = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _verifyCode() async {
    setState(() => _isLoading = true);
    try {
      final response = await authService.verifyCode(
          widget.phoneNumber, _codeController.text);

      if (!mounted) return;

      // AuthBloc 상태 업데이트
      context.read<AuthBloc>().emit(Authenticated(response.user.uid));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Text(
                '인증번호를\n입력해주세요.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.phoneNumber,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.gray500,
                    ),
              ),
              const SizedBox(height: 40),
              PinCodeField(
                controller: _codeController,
                onChanged: (value) {
                  setState(() {
                    _isValid = value.length == 6;
                  });
                },
              ),
              const Spacer(),
              Button(
                text: '인증하기',
                isLoading: _isLoading,
                onPressed: _isValid
                    ? () async {
                        await _verifyCode();
                      }
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
