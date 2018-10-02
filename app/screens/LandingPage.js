import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    SectionList,
    Button
} from "react-native";

import LaunchService from "../services/LaunchService";

export default class LandingPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Landing",
        headerTintColor: "#FFFFFF",
        headerStyle: styles.headerStyle
    });

    constructor(props) {
        super(props);
        this.state = {
            launchList: [],
            listRefreshing: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        var launchData = await LaunchService.getLaunchesAsync();
        this.setState({
            launchList: launchData
        });
    }

    async loadCacheData() {
        var launchData = await LaunchService.getCachedLaunchesAsync();
        this.setState({
            launchList: launchData
        });
    }

    renderSeparator = () => {
        return <View style={styles.separator} />;
    };

    render() {
        // const navigation = this.props.screenProps;
        return (
            <View style={styles.mainView}>
                <Button title="Load from Cache" onPress={async () => {
                    await this.loadCacheData();
                }}></Button>
                <Button title="Clear list" onPress={async () => {
                    this.setState({
                        launchList: JSON.parse('[]')
                    });
                }}></Button>
                <SectionList
                    style={styles.listView}
                    sections={this.state.launchList}
                    ItemSeparatorComponent={this.renderSeparator}
                    refreshing={this.state.listRefreshing}
                    onRefresh={async () => {
                        await this.loadData();
                    }}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader}>
                            {section.agency.name}
                        </Text>
                    )}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                 this.props.navigation.navigate("ItemDetails", {
                                    detailItem: item
                                });
                            }}
                        >
                            <View style={styles.listRow}>
                                <View style={styles.listRowColumn}>
                                    <Text style={styles.listRowLabel}>
                                        Launch Name:
                                    </Text>
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={styles.listRowColumn}>
                                    <Text style={styles.listRowLabel}>
                                        Location:
                                    </Text>
                                    <Text style={styles.listRowContent}>
                                        {item.location.name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "rgba(247,247,247,1.0)"
    },
    listView: {
        flex: 1
    },
    listRow: {
        flex: 1,
        flexDirection: "column",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    listRowColumn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    listRowLabel: {
        paddingRight: 10,
        width: 110
    },
    listRowContent: {
        flex: 1
    },
    headerStyle: {
        backgroundColor: "#2196F3"
    },
    headerButtonStyle: {
        color: "#FFFFFF",
        padding: 20
    },
    separator: {
        height: 1,
        backgroundColor: "#CED0CE",
        paddingLeft: 10,
        paddingRight: 10
    }
});