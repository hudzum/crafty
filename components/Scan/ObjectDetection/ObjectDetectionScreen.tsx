import { useState, useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { BottomBar } from './BottomBar';
import { getImage } from './camera';
import {
  Detection,
  useObjectDetection,
  SSDLITE_320_MOBILENET_V3_LARGE,
} from 'react-native-executorch';
import { View, StyleSheet, Image, Alert, Text } from 'react-native';
import ImageWithBboxes from './ImageWithBboxes';

export const ObjectDetectionScreen = ({
  imageUri,
  setImageUri,
}: {
  imageUri: string;
  setImageUri: (imageUri: string) => void;
}) => {
  const [results, setResults] = useState<Detection[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [error, setError] = useState<string | null>(null);

  const ssdLite = useObjectDetection({
    modelSource: SSDLITE_320_MOBILENET_V3_LARGE,
  });

  useEffect(() => {
    if (ssdLite.error) {
      console.error('Model loading error:', JSON.stringify(ssdLite.error));
      setError(ssdLite.error);
      Alert.alert('Error', 'Failed to load the model. Please check your internet connection and try again.');
    }
  }, [ssdLite.error]);

  const handleCameraPress = async (isCamera: boolean) => {
    const image = await getImage(isCamera);
    const uri = image?.uri;
    const width = image?.width;
    const height = image?.height;

    if (uri && width && height) {
      setImageUri(image.uri as string);
      setImageDimensions({ width: width as number, height: height as number });
      setResults([]);
    }
  };

  const runForward = async () => {
    if (imageUri) {
      try {
        const output = await ssdLite.forward(imageUri);
        console.log(output);
        setResults(output);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!ssdLite.isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner
          visible={!ssdLite.isReady}
          textContent={`Loading the model ${(ssdLite.downloadProgress * 100).toFixed(0)} %`}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.imageContainer}>
        <View style={styles.image}>
          {imageUri && imageDimensions?.width && imageDimensions?.height ? (
            <ImageWithBboxes
              imageUri={
                imageUri || require('../../../assets/images/favicon.png')
              }
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              detections={results}
            />
          ) : (
            <Image
              style={styles.fullSizeImage}
              resizeMode="contain"
              source={require('../../../assets/images/favicon.png')}
            />
          )}
        </View>
      </View>
      <BottomBar
        handleCameraPress={handleCameraPress}
        runForward={runForward}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 6,
    width: '100%',
    padding: 16,
  },
  image: {
    flex: 2,
    borderRadius: 8,
    width: '100%',
  },
  results: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  resultHeader: {
    fontSize: 18,
    color: 'navy',
  },
  resultsList: {
    flex: 1,
  },
  resultRecord: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
  },
  resultLabel: {
    flex: 1,
    marginRight: 4,
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});