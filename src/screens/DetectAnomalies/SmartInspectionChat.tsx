import { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GiftedChat,
  Actions,
  type IMessage,
  type User,
} from 'react-native-gifted-chat';

import CameraComponent, { pickSingleImageFromLibrary } from './Camera';

import { MaterialIcon } from '@/components/MaterialIcon';

const me: User = { _id: 'me', name: 'Me' };

export type PickResult = { uri: string } | null;

const SmartInspectionChat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [cameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 'hello',
        text: "Welcome! I'm the smart inspector. For any queries, please attach an image of the artifact you want to analyse and provide some description.",
        createdAt: new Date(),
        user: { _id: 'bot', name: 'Helper' },
      },
    ]);
  }, []);

  const append = useCallback(
    (newMessages: IMessage[]) =>
      setMessages(prev => GiftedChat.append(prev, newMessages)),
    [],
  );

  const formatUri = (uri: string): string => {
    if (!uri) return uri;
    if (
      uri.startsWith('file://') ||
      uri.startsWith('content://') ||
      uri.startsWith('http')
    ) {
      return uri;
    }
    if (Platform.OS === 'android' && uri.startsWith('/')) {
      return `file://${uri}`;
    }
    return uri;
  };

  const makeImageMessage = useCallback((uri: string): IMessage => {
    return {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date(),
      user: me,
      text: '',
      image: formatUri(uri), // GiftedChat will render this
    };
  }, []);

  const onSend = useCallback(
    async (newMsgs: IMessage[] = []) => {
      console.log('onSend', newMsgs);
      append(newMsgs);
      // Hook: send to backend here if needed
      // for (const m of newMsgs) await api.send(m)
    },
    [append],
  );

  // Called when the CameraComponent provides a photo/library URI
  const handlePickedUri = useCallback(
    (uri: string | null | undefined) => {
      if (!uri) return;
      onSend([makeImageMessage(uri)]);
      setCameraVisible(false);
    },
    [makeImageMessage, onSend],
  );

  // Action: open gallery directly (no camera UI)
  const onPickFromLibrary = useCallback(async (): Promise<PickResult> => {
    const res = await pickSingleImageFromLibrary();
    if (res?.uri) {
      onSend([makeImageMessage(res.uri)]);
    }
    return res ?? null;
  }, [makeImageMessage, onSend]);

  // Action: show camera modal. The camera screen also has a library CTA,
  // so the user can pick from either inside that screen if they change their mind.
  const onTakePhoto = useCallback(async (): Promise<PickResult> => {
    setCameraVisible(true);
    // We resolve the message when `handlePickedUri` fires; returning null here is fine.
    return null;
  }, []);

  const renderActions = useCallback(
    (props: Record<string, unknown>) => (
      <Actions
        {...props}
        containerStyle={styles.actionsContainer}
        icon={() => (
          <View style={styles.attachmentIcon}>
            <MaterialIcon name="attachment" size={22} />
          </View>
        )}
        options={{
          'Photo from library': () => onPickFromLibrary(),
          'Take a photo': () => onTakePhoto(),
          Cancel: () => {},
        }}
        optionTintColor="#222"
      />
    ),
    [onPickFromLibrary, onTakePhoto],
  );

  // If camera is visible, show only camera
  if (cameraVisible) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <View style={styles.cameraTopBar}>
          <TouchableOpacity
            onPress={() => setCameraVisible(false)}
            accessibilityLabel="Close camera"
            hitSlop={12}
            style={styles.closeBtn}>
            <MaterialIcon name="close" size={40} color="white" />
          </TouchableOpacity>
        </View>
        <CameraComponent loadPhotoURI={uri => handlePickedUri(uri)} />
      </SafeAreaView>
    );
  }

  // Otherwise show the chat
  return (
    <GiftedChat
      messages={messages}
      onSend={msgs => onSend(msgs)}
      user={me}
      placeholder="Type a message..."
      alwaysShowSend
      renderActions={renderActions}
      showUserAvatar
      renderUsernameOnMessage
    />
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraTopBar: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 8,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginLeft: 8,
    marginBottom: 8,
  },
  attachmentIcon: {
    marginBottom: 8,
  },
});

export default SmartInspectionChat;
