import { View, Image, Animated, Dimensions } from "react-native";
import { API_URL } from '@env';
import { useEffect, useState, useContext, useRef, createRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;
import Entity from './Entity';

const CampaignMap = ({route, characters, initialSize}: Props) => {
    const [data, setData] = useState({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const defaultScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const mapRef = createRef();
    const [dimensions, setDimensions] = useState({width: 0, height: 0})
    let prevValues = {x: 0, y: 0, scale: 1};
    const [entities, setEntities] = useState([]);

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
        setEntities([2, 3]); // This is the list of initial npc and player characters and the like, could also be used for stuff like environmental objects, but right now its just dummy data to demonstrate entities
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
    const minZoom = 1;
    const maxZoom = 8;
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

    const initialOffsets = ({imgWidth, imgHeight, screenWidth, screenHeight}) => {
        prevValues.x -= ((imgWidth / 2) - (screenWidth / 2));
        prevValues.y -= ((imgHeight / 2) - (screenHeight / 2));
        translateX.setOffset(prevValues.x);
        translateX.setValue(0);
        translateY.setOffset(prevValues.y);
        translateY.setValue(0);
    }

    const entityMap = entities.map(entity => {
        return <Entity route={route} character={characters} initialSize={initialSize}/>; // We would feed specific character information in to actually render it, but right now that isn't implemented, so i just put "characters" where it would go
    });

    return (
        <Animated.View
            style={{
                height: Dimensions.get('window').height
            }}
        >
            <PanGestureHandler
                onGestureEvent={MapPanHandler}
                onHandlerStateChange={panStateChanged}
                ref={panRef}
                simultaneousHandlers={[pinchRef]}
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
                                width: dimensions.width,
                                height: dimensions.height,
                                transform: [
                                    {translateX},
                                    {translateY},
                                    {scale}
                                ]
                            }}
                            source={{
                                uri: API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'
                            }}
                            ref={mapRef}
                            onLoad={(event) => {
                                let imgWidth = event.nativeEvent.source.width;
                                let imgHeight = event.nativeEvent.source.height;
                                let scaling = imgWidth / imgHeight
                                if (scaling > 1) {
                                    setDimensions({
                                        width: scaling * initialSize.height,
                                        height: initialSize.height
                                    });
                                } else {
                                    setDimensions({
                                        width: initialSize.width,
                                        height: scaling * initialSize.width
                                    })
                                }
                            }}
                        />
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>
            <Animated.View
                style={{
                    zIndex: 1,
                    position: 'absolute',
                    transform: [
                        {translateX},
                        {translateY},
                        {scale}
                    ]
                }}
            >
                {entityMap}
            </Animated.View>
        </Animated.View>
    );
};

export default CampaignMap;