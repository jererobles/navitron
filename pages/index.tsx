// @generated: @expo/next-adapter@2.1.52
import React, { useState, useEffect, createElement } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    ActivityIndicator,
    SectionList,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import FreeRoomSearcher from "../service";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AvailableTimeSlot } from "../service/room";

function HomeScreen({ navigation }) {
    const [date, setDate] = useState(new Date());
    const [timeFrom, setTimeFrom] = useState(new Date(1647498600000));
    const [timeTo, setTimeTo] = useState(new Date(1647529200000));
    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);
    const [duration, setDuration] = useState("1:00");
    const [floorOpen, setFloorOpen] = useState(false);
    const [roomTypesOpen, setRoomTypesOpen] = useState(false);
    const [floorValue, setFloorValue] = useState(["m2001422", "m2001421"]);
    const [floorItems, setFloorItems] = useState([
        { label: "1.Floor", value: "m2001418" },
        { label: "2.Floor", value: "m2001419" },
        { label: "3.Floor", value: "m2001420" },
        { label: "Alempi kellarikerros", value: "m2001422" },
        { label: "Ylempi kellarikerros", value: "m2001421" },
    ]);
    const [roomTypesValue, setRoomTypesValue] = useState([4200042, 4100216]);
    const [roomTypesItems, setRoomTypesItems] = useState([
        { label: "Teamwork room", value: 4200042 },
        { label: "Student room", value: 4100216 },
        { label: "Silent working room", value: 4100003 },
        { label: "Phone booth", value: 4100004 },
        { label: "Informal meeting room", value: 4100005 },
        { label: "Video conference room", value: 4100125 },
    ]);
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };
    const onTimeFromChange = (event, selectedDate) => {
        const currentTime = selectedDate;
        setTimeFrom(currentTime);
    };
    const onTimeToChange = (event, selectedDate) => {
        const currentTime = selectedDate;
        setTimeTo(currentTime);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const Header = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Navitron 👋</Text>
                <Text style={styles.text}>The Useful Navi App</Text>
            </View>
        );
    };
    return (
        <>
            {/* <Header></Header> */}
            <View style={styles.container}>
                {/* <Text>
                    Looking for a room on {date.getDay().toString()}-
                    {date.getMonth().toString()}-{date.getFullYear().toString()}{" "}
                    from {time.getHours().toString()}:
                    {time.getMinutes().toString()} for {duration} minutes
                </Text> */}
                <Text style={styles.inputLabel}>Floor</Text>
                <DropDownPicker
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={{
                        ...styles.input,
                        borderColor: "#ddd",
                    }}
                    mode="BADGE"
                    showBadgeDot={false}
                    badgeTextStyle={styles.inputBadge}
                    badgeColors={["#e3e3e4"]}
                    multiple={true}
                    open={floorOpen}
                    value={floorValue}
                    items={floorItems}
                    setOpen={setFloorOpen}
                    setValue={setFloorValue}
                    setItems={setFloorItems}
                />
                <Text style={styles.inputLabel}>Room type</Text>
                <DropDownPicker
                    zIndex={2000}
                    zIndexInverse={2000}
                    style={{
                        ...styles.input,
                        borderColor: "#ddd",
                    }}
                    mode="BADGE"
                    showBadgeDot={false}
                    badgeTextStyle={styles.inputBadge}
                    badgeColors={["#e3e3e4"]}
                    multiple={true}
                    open={roomTypesOpen}
                    value={roomTypesValue}
                    items={roomTypesItems}
                    setOpen={setRoomTypesOpen}
                    setValue={setRoomTypesValue}
                    setItems={setRoomTypesItems}
                />
                <Text style={styles.inputLabel}>Search within</Text>
                <View style={styles.timeContainer}>
                    {
                        // FIXME: actually we should be wrapping the DateTimePicker to handle web case
                        Platform.OS === "web" ? (
                            createElement("input", {
                                type: "time",
                                value: timeFrom,
                                onInput: onTimeFromChange,
                            })
                        ) : (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={timeFrom}
                                mode={"time"}
                                is24Hour={true}
                                onChange={onTimeFromChange}
                                style={styles.input}
                            />
                        )
                    }
                    <Text style={{ ...styles.inputLabel, lineHeight: 9 }}>
                        {" "}
                        -{" "}
                    </Text>
                    {
                        // FIXME: actually we should be wrapping the DateTimePicker to handle web case
                        Platform.OS === "web" ? (
                            createElement("input", {
                                type: "time",
                                value: timeTo,
                                onInput: onTimeToChange,
                            })
                        ) : (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={timeTo}
                                mode={"time"}
                                is24Hour={true}
                                onChange={onTimeToChange}
                                style={styles.input}
                            />
                        )
                    }
                    {
                        // FIXME: actually we should be wrapping the DateTimePicker to handle web case
                        Platform.OS === "web" ? (
                            createElement("input", {
                                type: "date",
                                value: date,
                                onInput: onDateChange,
                            })
                        ) : (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onDateChange}
                                style={{ ...styles.input, flexGrow: 2 }}
                            />
                        )
                    }
                </View>
                <Text style={styles.inputLabel}>Duration</Text>
                <Picker
                    style={styles.input}
                    selectedValue={duration}
                    onValueChange={(itemValue, itemIndex) =>
                        setDuration(itemValue)
                    }
                >
                    <Picker.Item label="15 minutes" value="0:15" />
                    <Picker.Item label="30 minutes" value="0:30" />
                    <Picker.Item label="45 minutes" value="0:45" />
                    <Picker.Item label="1 hour" value="1:00" />
                    <Picker.Item label="1 hour 15 minutes" value="1:15" />
                    <Picker.Item label="1 hour 30 minutes" value="1:30" />
                    <Picker.Item label="1 hour 45 minutes" value="1:45" />
                    <Picker.Item label="2 hours" value="2:00" />
                    <Picker.Item label="2 hours 15 minutes" value="2:15" />
                    <Picker.Item label="2 hours 30 minutes" value="2:30" />
                    <Picker.Item label="2 hours 45 minutes" value="2:45" />
                    <Picker.Item label="3 hours" value="3:00" />
                    <Picker.Item label="3 hours 15 minutes" value="3:15" />
                    <Picker.Item label="3 hours 30 minutes" value="3:30" />
                    <Picker.Item label="3 hours 45 minutes" value="3:45" />
                    <Picker.Item label="4 hours" value="4:00" />
                </Picker>
                <Button
                    title="Search Navi"
                    onPress={() => {
                        // Pass input values to the SearchResult component
                        const prevMonday = date;
                        prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
                        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(prevMonday);
                        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(prevMonday);
                        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(prevMonday);
                        const targetWeek = `${ye}-${mo}-${da}`;
                        const targetTimeFrom = `${timeFrom.getHours()}:${timeFrom.getMinutes()}`;
                        const targetTimeTo = `${timeTo.getHours()}:${timeTo.getMinutes()}`;
                        console.log("targetWeek: ", targetWeek);
                        console.log("targetTimeFrom: ", targetTimeFrom);
                        console.log("targetTimeTo: ", targetTimeTo);
                        console.log("duration: ", duration);
                        console.log("floorValue: ", floorValue);
                        console.log("roomTypesValue: ", roomTypesValue);
                        navigation.navigate("SearchResult", {
                            targetWeek,
                            targetTimeFrom,
                            targetTimeTo,
                            duration,
                            floorValue,
                            roomTypesValue,
                        });
                    }}
                />
            </View>
        </>
    );
}

function RoomsList({ route }) {
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const {
        targetWeek,
        targetTimeFrom,
        targetTimeTo,
        duration,
        floorValue,
        roomTypesValue,
    } = route.params;

    useEffect(() => {
        const searcher = new FreeRoomSearcher(roomTypesValue);
        const freeRoomsResults = searcher.find(targetWeek, [], targetTimeFrom, targetTimeTo, duration);
        freeRoomsResults.then((timeSlots) => {
            console.log("original length: ", timeSlots.length)
            const groupedSlots = timeSlots.reduce((acc, curr: AvailableTimeSlot) => {
                const dayGroup = acc.find((section) => section.title === curr.day)
                if (!dayGroup) {
                    acc.push({
                        title: curr.day,
                        data: [{ roomName: curr.room.name, times: [{ start: curr.start, end: curr.end }] }]
                    });
                } else {
                    const roomGroup = dayGroup.data.find((section) => section.roomName === curr.room.name);
                    if (!roomGroup) {
                        dayGroup.data.push({ roomName: curr.room.name, times: [{ start: curr.start, end: curr.end }] });
                        dayGroup.data.sort((a, b) => a.roomName.localeCompare(b.roomName));
                    } else {
                        roomGroup.times.push({ start: curr.start, end: curr.end });
                    }
                }
                return acc;
            }, []);
            const sorter = {
                "Monday": 1,
                "Tuesday": 2,
                "Wednesday": 3,
                "Thursday": 4,
                "Friday": 5,
                "Saturday": 6,
                "Sunday": 7
            }
            groupedSlots.sort((a, b) => sorter[a.title] - sorter[b.title]);
            console.log(groupedSlots);
            setAvailableTimeSlots(groupedSlots);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <View style={styles.containerCenter}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const Item = ({ roomTimes }) => (
        <View>
            <Text style={styles.sectionListItemStyle}>{roomTimes.roomName}: {roomTimes.times.reduce((acc, curr) => {
                acc.push(`${curr.start} - ${curr.end}`);
                return acc;
            }, []).join(', ')}</Text>
        </View>
    );

    const FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={styles.listItemSeparatorStyle} />
        );
    };

    return (
        <View>
            <SectionList
                sections={availableTimeSlots}
                keyExtractor={(item, index) => (new Date()).getTime().toString() + index}
                renderItem={({ item }) => <Item roomTimes={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeaderStyle}>{title}</Text>
                )}
                ItemSeparatorComponent={FlatListItemSeparator}
            />
        </View>
    );
}

const RootStack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <RootStack.Navigator>
                <RootStack.Group>
                    <RootStack.Screen name="Home" component={HomeScreen} options={{ title: "Navitron" }} />
                </RootStack.Group>
                <RootStack.Group screenOptions={{ presentation: "modal" }}>
                    <RootStack.Screen
                        name="SearchResult"
                        component={RoomsList}
                        options={({ navigation }) => ({
                            headerShown: true,
                            title: 'Available Rooms',
                            headerRight: () => <Button onPress={() => navigation.pop()} title="Done" />,
                        })}
                    />
                </RootStack.Group>
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 8,
    },
    container: {
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        padding: 30,
    },
    containerCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 15,
        flexGrow: 1,
    },
    input: {
        marginBottom: 20,
        padding: 10,
        flexGrow: 1,
        alignSelf: "stretch",
    },
    inputLabel: {
        fontSize: 15,
        marginBottom: 8,
    },
    inputBadge: {
        fontSize: 13,
    },
    timeContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
    },
    header: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    sectionHeaderStyle: {
        backgroundColor: '#CDDC89',
        fontSize: 20,
        padding: 5,
        color: '#fff',
    },
    sectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: '#000',
        backgroundColor: '#F5F5F5',
    },
    listItemSeparatorStyle: {
        borderBottomColor: '#C8C8C8',
        borderBottomWidth: 0.4,
        borderStyle: 'solid',
        width: '100%',
    },
});
