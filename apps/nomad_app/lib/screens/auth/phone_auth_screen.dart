import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nomad_app/screens/auth/verification_screen.dart';
import 'package:nomad_app/components/ui/button.dart';
import 'package:nomad_app/screens/map/map_screen.dart';
import 'package:nomad_app/services/auth/auth_service.dart';
import 'package:flutter_svg/flutter_svg.dart';

class PhoneAuthScreen extends StatefulWidget {
  const PhoneAuthScreen({super.key});

  @override
  State<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  final _phoneController = TextEditingController();
  bool _isValid = false;
  bool _isLoading = false;

  Future<void> _requestVerification() async {
    setState(() => _isLoading = true);
    try {
      await authService.sendVerification(_phoneController.text);
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => VerificationScreen(
            phoneNumber: _phoneController.text,
          ),
        ),
      );
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
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _validatePhone(String value) {
    setState(() {
      _isValid = value.length == 13; // 010-0000-0000 형식
      if (_isValid) {
        _requestVerification();
      }
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
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.15),
              SvgPicture.asset(
                'assets/images/hand_wave.svg',
                width: 128,
                height: 128,
              ),
              const SizedBox(height: 24),
              Text(
                '안녕하세요!\n전화번호를 입력해주세요.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  textAlign: TextAlign.center,
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
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: Button(
                  text: '인증번호 받기',
                  isLoading: _isLoading,
                  onPressed: _isValid ? _requestVerification : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
