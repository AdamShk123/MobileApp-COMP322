import { View, Image, Animated, Dimensions } from "react-native";
import { API_URL } from '@env';
import { useEffect, useState, useContext, useRef, createRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;

const Entity = ({route, character, initialSize}: Props) => {
    const [data, setData] = useState({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const screenDimensions = {width: Dimensions.get('window').height, height: Dimensions.get('window').height};
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const pinchRef = createRef();
    const panRef = createRef();
    const entityRef = createRef();
    const spriteSource = API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'; // We would replace this with a sprite uri in actual use, but its just the map for demonstration
    const minZoom = 0.25;
    const maxZoom = 4;
    const [dimensions, setDimensions] = useState({width: 0, height: 0})
    const defaultScale = useRef(new Animated.Value(1)).current;
    let prevValues = {x: 0, y: 0, scale: 1};

    useEffect(() => {
        if (route.params.id) {
            setID(route.params.id);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
            });
        }
        translateX.setOffset(prevValues.x);
        translateX.setValue(0);
        translateY.setOffset(prevValues.y);
        translateY.setValue(0);
        baseScale.setValue(1);
    }, [route.params]);

    if(!route.params.id && !id){
        return (<></>);
    }

    const entityPinchHandler = Animated.event([{
        nativeEvent: {
            scale: pinchScale
        }}],
        {
            useNativeDriver: true
        });

    const pinchStateChanged = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            prevValues.scale *= nativeEvent.scale;
            baseScale.setValue(prevValues.scale);
            pinchScale.setValue(1);
            if (baseScale.__getValue() > maxZoom) {
                baseScale.setValue(maxZoom);
                prevValues.scale = maxZoom;
            } else if (baseScale.__getValue() < minZoom) {
                baseScale.setValue(minZoom);
                prevValues.scale = minZoom;
            }
        }
    };

    const entityPanHandler = Animated.event([{
        nativeEvent: {
            translationX: translateX,
            translationY: translateY
        }}],
        {
            useNativeDriver: true
    });

    const panStateChanged = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            prevValues.x += nativeEvent.translationX;
            prevValues.y += nativeEvent.translationY;
            translateX.setOffset(prevValues.x);
            translateX.setValue(0);
            translateY.setOffset(prevValues.y);
            translateY.setValue(0);
        }
    };

    return (
        <Animated.View
            style={{
                position: 'absolute',
                transform: [
                    {translateX},
                    {translateY},
                    {scale}
                ]
            }}
        >
            <PanGestureHandler
                onGestureEvent={entityPanHandler}
                onHandlerStateChange={panStateChanged}
                ref={panRef}
                simultaneousHandlers={[pinchRef]}
            >
                <Animated.View>
                    <PinchGestureHandler
                        onGestureEvent={entityPinchHandler}
                        onHandlerStateChange={pinchStateChanged}
                        ref={pinchRef}
                        simultaneousHandlers={[panRef]}
                    >
                        <Animated.Image
                            style={{
                                width: dimensions.width,
                                height: dimensions.height
                            }}
                            source={{
                                uri: spriteSource
                            }}
                            ref={entityRef}
                            onLoad={(event) => {
                                let imgWidth = event.nativeEvent.source.width;
                                let imgHeight = event.nativeEvent.source.height;
                                let scaling = imgWidth / imgHeight
                                if (scaling > 1) {
                                    setDimensions({
                                        width: scaling * initialSize.height / 5,
                                        height: initialSize.height / 5
                                    });
                                } else {
                                    setDimensions({
                                        width: initialSize.width / 5,
                                        height: scaling * initialSize.width / 5
                                    })
                                }
                            }}
                        />
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
};

export default Entity;