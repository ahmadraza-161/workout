import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n';
import { spacing } from '../theme';
import { Button } from './Button';
import { Text } from './Text';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Catches render errors so one broken screen never takes down the whole app
// (ARCHITECTURE §12). No crash-reporting SDK: Play Console covers crashes.
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) console.error('ErrorBoundary caught', error, info.componentStack);
  }

  private readonly retry = (): void => this.setState({ error: null });

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.container}>
        <Text variant="h2">{t('errors.generic.title')}</Text>
        <Text tone="secondary" style={styles.body}>
          {t('errors.generic.body')}
        </Text>
        <Button label={t('errors.generic.retry')} onPress={this.retry} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing[6], gap: spacing[4] },
  body: { textAlign: 'left' },
});
