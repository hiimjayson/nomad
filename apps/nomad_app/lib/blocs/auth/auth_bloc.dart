import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../services/auth/auth_service.dart';
import '../../services/auth/token_storage.dart';

// Events
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {}

class AuthLogoutRequested extends AuthEvent {}

class AuthenticatedEvent extends AuthEvent {
  final String uid;

  AuthenticatedEvent(this.uid);

  @override
  List<Object?> get props => [uid];
}

// States
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final String uid;
  const Authenticated(this.uid);

  @override
  List<Object?> get props => [uid];
}

class Unauthenticated extends AuthState {}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthService _authService;

  AuthBloc({required AuthService authService})
      : _authService = authService,
        super(AuthInitial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
    on<AuthLogoutRequested>(_onAuthLogoutRequested);
    on<AuthenticatedEvent>((event, emit) {
      emit(Authenticated(event.uid));
    });
  }

  Future<void> _onAuthCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken == null) {
        emit(Unauthenticated());
        return;
      }

      final tokens = await _authService.refreshToken();
      emit(Authenticated(tokens.uid)); // 실제 uid 사용
    } catch (e) {
      await TokenStorage.deleteTokens(); // 토큰 갱신 실패시 삭제
      emit(Unauthenticated());
    }
  }

  Future<void> _onAuthLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await TokenStorage.deleteTokens();
    emit(Unauthenticated());
  }
}
