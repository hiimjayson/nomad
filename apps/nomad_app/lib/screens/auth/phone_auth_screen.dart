import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nomad_app/screens/auth/verification_screen.dart';
import 'package:nomad_app/components/ui/button.dart';
import 'package:nomad_app/services/auth/auth_service.dart';

class PhoneAuthScreen extends StatefulWidget {
  const PhoneAuthScreen({super.key});

  @override
  State<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  final _phoneController = TextEditingController();
  bool _isValid = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _validatePhone(String value) {
    setState(() {
      _isValid = value.length == 13; // 010-0000-0000 형식
    });
  }

  void _formatPhone(String value) {
    if (value.length > 13) return;

    var newValue = value.replaceAll('-', '');
    if (newValue.length > 3) {
      newValue = '${newValue.substring(0, 3)}-${newValue.substring(3)}';
    }
    if (newValue.length > 8) {
      newValue = '${newValue.substring(0, 8)}-${newValue.substring(8)}';
    }

    if (newValue != value) {
      _phoneController.value = TextEditingValue(
        text: newValue,
        selection: TextSelection.collapsed(offset: newValue.length),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 60),
              Text(
                '안녕하세요!\n전화번호를 입력해주세요.',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 40),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  hintText: '010-0000-0000',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onChanged: (value) {
                  _formatPhone(value);
                  _validatePhone(value);
                },
              ),
              const Spacer(),
              Button(
                text: '인증번호 받기',
                isLoading: _isLoading,
                onPressed: _isValid
                    ? () async {
                        setState(() => _isLoading = true);
                        try {
                          await authService
                              .sendVerification(_phoneController.text);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => VerificationScreen(
                                phoneNumber: _phoneController.text,
                              ),
                            ),
                          );
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(e.toString())),
                          );
                        } finally {
                          setState(() => _isLoading = false);
                        }
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
