import { View, Image, Animated, Text } from "react-native";
import { API_URL } from '@env';
import { useEffect, useState, useContext, useRef, createRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;

const Entity = ({route}: Props) => {
    const [data, setData] = useState({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const [entityDimensions, setEntityDimensions] = useState({width: 0, height: 0});
    let prevValues = {x: 0, y: 0, scale: 1};

    useEffect(() => {
        if(route.params.id){
            setID(route.params.id);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
                facadeService.updateCampaignPlayedData(data.id);
            });
        }
        translateX.setOffset(prevValues.x);
        translateX.setValue(0);
        translateY.setOffset(prevValues.y);
        translateY.setValue(0);
        baseScale.setValue(1);
        setEntityDimensions({width: 500, height: 500});
    }, [route.params]);
    if(!route.params.id && !id){
        return (<></>);
    }
    const MapPinchHandler = Animated.event([{
        nativeEvent: {
            scale: pinchScale
        }}],
        {
            useNativeDriver: true
        });
    const minZoom = 0.25;
    const maxZoom = 4;
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
    const MapPanHandler = Animated.event([{
        nativeEvent: {
            translationX: translateX,
            translationY: translateY
        }}],
        {
            useNativeDriver: true
        });
    const pinchRef = createRef()
    const panRef = createRef()

    return (
        <Animated.View
            style={{
                position: 'fixed',
                top: 0,
                transform: [
                    {translateX},
                    {translateY},
                    {scale}
                ]
            }}
        >
            <PanGestureHandler
                onGestureEvent={MapPanHandler}
                onHandlerStateChange={panStateChanged}
                ref={panRef}
                simultaneousHandlers={[pinchRef]}
                shouldCancelWhenOutside
            >
                <Animated.View>
                    <PinchGestureHandler
                        onGestureEvent={MapPinchHandler}
                        onHandlerStateChange={pinchStateChanged}
                        ref={pinchRef}
                        simultaneousHandlers={[panRef]}
                    >
                        <Animated.Image
                            style={{
                                zIndex: -1,
                                width: '100%',
                                height: '100%',
                            }}
                            source={{
                                uri: API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'
                            }}
                            onLoad={() => {
                                console.log('MODIFY THIS TO FIX WIDTH AND HEIGHT');
                            }}
                        />
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
};

export default Entity;