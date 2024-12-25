// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import homescreenPaths from "../../helpers/homescreenPaths";
// import bookPaths from "../../helpers/bookPathsHelpers";
// import BaseView from "../../components/ViewTypes/BaseView";
// import MelodyView from "../../components/ViewTypes/MelodyView";
// import TitleView from "../../components/ViewTypes/TitleView";
// import RitualView from "../../components/ViewTypes/RitualView";
// import ButtonView from "../../components/ViewTypes/ButtonView";
// import MainTitleView from "../../components/ViewTypes/MainTitleView";

// const localData = homescreenPaths["kiahkPsalmody"];
// const PAGE_SIZE = 20; // Number of items to load per page

// const TestPage = () => {
//   const flatListRef = useRef(null);

//   // Initialize state
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(0);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [loading, setLoading] = useState(false); // New state for loading

//   // Load data for the current page
//   const loadDataForPage = (currentPage) => {
//     const startIndex = currentPage * PAGE_SIZE;
//     const endIndex = startIndex + PAGE_SIZE;
//     const newItems = [];
//     localData.Main.slice(startIndex, endIndex).forEach((item) => {
//       if (item.Type === "Main") {
//         const book = bookPaths[item.Path];

//         // Add Title object to newItems
//         newItems.push({
//           Type: "Title",
//           rule: -1,
//           visible: 0,
//           Side: "Title",
//           Arabic: book.ArabicTitle,
//           Coptic: book.CopticTitle,
//           English: book.EnglishTitle,
//           Path: item.Path,
//         });

//         const hymns = book?.Hymn || [];

//         // Map over the hymns and add the new field
//         const hymnsWithNewField = hymns.map((hymn) => ({
//           ...hymn, // Keep existing hymn properties
//           Path: item.Path, // Add the new field with a value (you can customize this)
//         }));
//         newItems.push(...hymnsWithNewField); // Push hymns with the new field
//       } else if (item.Type === "MainTitle") {
//         // Push the entire MainTitle item directly
//         newItems.push(item);
//       }
//     });

//     return newItems;
//   };

//   // Load initial data
//   useEffect(() => {
//     const initialData = loadDataForPage(0);
//     setData(initialData);
//   }, []);

//   // Load more data when reaching the end of the list
//   const loadMoreData = () => {
//     setLoading(true); // Set loading to true when loading more data
//     const nextPage = page + 1;
//     const newItems = loadDataForPage(nextPage);

//     if (newItems.length > 0) {
//       setData((prevData) => [...prevData, ...newItems]);
//       setPage(nextPage);
//     }

//     setLoading(false); // Set loading to false after loading is complete
//   };

//   // Scroll to the specified item
//   const scrollToIndex = (item) => {
//     const indexToScroll = data.findIndex((dat) => dat.Path === item.Path);
//     if (indexToScroll !== -1 && flatListRef.current) {
//       flatListRef.current.scrollToIndex({
//         index: indexToScroll,
//         animated: false,
//       });
//     }
//   };

//   // Trigger load more data manually when needed (simulate onEndReached)
//   const triggerLoadMore = () => {
//     loadMoreData(); // Manually load more data
//     if (flatListRef.current) {
//       flatListRef.current.scrollToEnd({ animated: false }); // Scroll to the end to simulate the effect
//     }
//   };

//   // Render each item
//   const renderItem = ({ item }) => {
//     const viewTypeMap = {
//       Base: <BaseView item={item} mykey={0} />,
//       Melody: <MelodyView item={item} />,
//       Title: <TitleView item={item} navigation={null} />,
//       Ritual: <RitualView item={item} />,
//       MainTitle: <MainTitleView item={item} />,
//       Button: <ButtonView item={item} />,
//     };

//     return viewTypeMap[item.Type] || <Text>Unknown View Type</Text>;
//   };

//   // Open and close menu
//   const openMenu = () => setMenuVisible(true);
//   const closeMenu = () => setMenuVisible(false);

//   return (
//     <View style={styles.container}>
//       {/* Open Menu Button */}
//       <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
//         <Text style={styles.menuButtonText}>Open Titles Menu</Text>
//       </TouchableOpacity>

//       {/* Menu Modal */}
//       <Modal visible={menuVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select a Title</Text>
//             <ScrollView>
//               {localData.Main.map((item, index) => (
//                 <TouchableOpacity
//                   key={index} // Use unique key (Path)
//                   onPress={() => {
//                     const startIndex = page * PAGE_SIZE;
//                     const endIndex = startIndex + PAGE_SIZE;
//                     const myind = localData.Main.findIndex(
//                       (loc) => loc.Path === item.Path
//                     );

//                     // If the index is within the current loaded range
//                     if (myind < endIndex) {
//                       scrollToIndex(item);
//                     } else {
//                       const loadMoreTimes = 3;

//                       // Function to trigger loading more items
//                       const triggerLoadMore = (times) => {
//                         if (times > 0) {
//                           // Trigger the onEndReached behavior manually by calling the function
//                           flatListRef.current?.scrollToEnd({
//                             animated: true,
//                           });

//                           // Wait for a short delay before triggering again
//                           setTimeout(() => triggerLoadMore(times - 1), 500); // Adjust delay as needed
//                         }
//                       };

//                       // Start the load more process
//                       triggerLoadMore(loadMoreTimes);
//                       //   let indexToScroll = data.findIndex(
//                       //     (dat) => dat.Path === item.Path
//                       //   );
//                       //   while (indexToScroll === -1) {
//                       //     flatListRef.current.scrollToEnd({ animated: false }); // Scroll to the end to simulate the effect
//                       //     indexToScroll = data.findIndex(
//                       //       (dat) => dat.Path === item.Path
//                       //     );
//                       //     console.log(indexToScroll);
//                       //   }
//                       //scrollToIndex(item);
//                     }

//                     closeMenu();
//                   }}
//                   style={styles.menuItem}
//                 >
//                   <Text style={styles.menuItemText}>
//                     {bookPaths[item.Path]?.EnglishTitle}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* List of Data */}
//       <FlatList
//         ref={flatListRef}
//         data={data}
//         keyExtractor={(item, index) => index.toString()} // Unique key for each item (path)
//         renderItem={renderItem}
//         onEndReached={loadMoreData}
//         onEndReachedThreshold={0.5}
//         initialNumToRender={data.length}
//         ListFooterComponent={
//           loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
//         } // Show activity indicator when loading more data
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   loadMoreButton: {
//     padding: 10,
//     backgroundColor: "#28a745",
//     borderRadius: 5,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   loadMoreText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   itemContainer: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   englishText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   arabicText: {
//     fontSize: 18,
//     color: "#333",
//   },
//   copticText: {
//     fontSize: 14,
//     color: "#555",
//   },
//   menuButton: {
//     padding: 10,
//     backgroundColor: "#007BFF",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   menuButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   menuItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   menuItemText: {
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#FF0000",
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//   },
// });

// export default TestPage;
