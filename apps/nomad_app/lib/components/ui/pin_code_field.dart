import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:nomad_app/core/theme/app_colors.dart';

class PinCodeField extends StatelessWidget {
  final TextEditingController controller;
  final void Function(String) onChanged;
  final int length;
  final double fieldHeight;
  final double fieldWidth;
  final bool autoFocus;

  const PinCodeField({
    super.key,
    required this.controller,
    required this.onChanged,
    this.length = 6,
    this.fieldHeight = 56,
    this.fieldWidth = 44,
    this.autoFocus = true,
  });

  @override
  Widget build(BuildContext context) {
    return PinCodeTextField(
      appContext: context,
      length: length,
      controller: controller,
      onChanged: onChanged,
      autoFocus: autoFocus,
      cursorColor: AppColors.primary,
      keyboardType: TextInputType.number,
      enableActiveFill: true,
      pinTheme: PinTheme(
        shape: PinCodeFieldShape.box,
        borderRadius: BorderRadius.circular(12),
        fieldHeight: fieldHeight,
        fieldWidth: fieldWidth,
        activeFillColor: AppColors.white,
        selectedFillColor: AppColors.white,
        inactiveFillColor: AppColors.white,
        borderWidth: 1,
        activeColor: AppColors.primary,
        selectedColor: AppColors.primary,
        inactiveColor: AppColors.gray300,
      ),
      animationType: AnimationType.fade,
      animationDuration: const Duration(milliseconds: 300),
      backgroundColor: Colors.transparent,
    );
  }
}
