import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
}


export default function Index() {

  // const todoData = [
  //   {
  //     id: 1,
  //     title: "Todo 1",
  //     isDone: false
  //   },
  //   {
  //     id: 2,
  //     title: "Todo 2",
  //     isDone: false
  //   },
  //   {
  //     id: 3,
  //     title: "Todo 3",
  //     isDone: false
  //   },
  //   {
  //     id: 4,
  //     title: "Todo 4",
  //     isDone: true
  //   },
  // ];

  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");

  // Runs on every render of the application - check existing Todo items in Async storage and displays in the application
  useEffect(() => {
    const getTodos = async() => {
      try {
        const todos = await AsyncStorage.getItem('my-todo');
        if (todos !== null) {
          setTodos(JSON.parse(todos));
        }
      }
      catch (error) {
        console.log(error)
      }
    };
    getTodos();
  }, [])


  // Add a Todo item to the application and save it to Async Storage
  const addTodo = async () => {
    try {
      // Check if the input is empty
      if (!todoText.trim()) {
        return;
      }
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false
      };
      todos.push(newTodo);
      setTodos(todos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(todos))
      setTodoText('');
    }
    catch (errors) {
      console.log(errors)
    }
  }

  //Confirmation box for delete a task
  const confirmDeleteTodo = (id: number) => {
    Alert.alert(
      'Delete Task', 
      'Are you sure you want to delete the task?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {deleteTodo(id);}
        }

      ],
      {cancelable: true}
    );
  };

  // Delete a Todo item from the application and from Async Storage
  const deleteTodo = async(id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
    }
    catch (error) {
      console.log(error)
    }
  }

  //Conformation box for delete All Todos
  const confirmDeleteAll = () => {
    // Check if there are no todos
    if (todos.length === 0) {
      return;
    }
    Alert.alert(
      'Delete All Tasks', 
      'Are you sure you want to delete all tasks?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {deleteAllTodos();}
        }

      ],
      {cancelable: true}
    );
  };

  // Delete All Todos
  const deleteAllTodos = async() => {
    try {
      await AsyncStorage.setItem('my-todo', JSON.stringify([]));
      setTodos([]);
    }
    catch (error)
    {
      console.log(error)
    }
  }

  // Checkmark 
  const handleDone = async(id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone; 
        }
        return todo;
      });
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Line */}
      <View style={styles.headerContainer}><Text style={styles.headerText}>ToDo Application</Text></View>

      {/* Delete All Button */}
      <View>
        <TouchableOpacity style={styles.deleteAll} onPress={() => confirmDeleteAll()}>
          <Ionicons name="trash-outline" size={30} color='black' />
        </TouchableOpacity>
      </View>
      
      {/* List ToDo items */}
      {(todos.length === 0) ? 
      (<View style={styles.emptyContainer}>
        <Text style={styles.emptyContainerText}>
          Add a Task!
        </Text>
      </View>) : 
      ( 
      <FlatList 
      data={todos} 
      keyExtractor={(item) => item.id.toString()} 
      renderItem={({item}) => (<ToDoItem item={item} confirmDeleteTodo={confirmDeleteTodo} handleTodo={handleDone}/>)} />  
      )} 

      {/* Add ToDo box */}
      <KeyboardAvoidingView style={styles.footer} behavior="padding" keyboardVerticalOffset={10}>
        <TextInput style={styles.todoAddText} multiline={true} textAlignVertical="top" onChangeText={(text) => setTodoText(text)} value={todoText} placeholder="Add New Task"/>
        <TouchableOpacity style={styles.todoAddButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={30} color={'black'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Function to Render ToDo Items
const ToDoItem = ({item, confirmDeleteTodo, handleTodo} : {item: ToDoType, confirmDeleteTodo: (id: number) => void , handleTodo: (id: number) => void}) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox value={item.isDone} onValueChange={() => handleTodo(item.id)}/>
      <Text style={[styles.todoText, item.isDone && {textDecorationLine: "line-through"}]}>{item.title}</Text>
    </View>
      <TouchableOpacity style={styles.deleteTodo} onPress={() => {confirmDeleteTodo(item.id)}}>
        <Ionicons name="close-circle-outline" size={24} color={'black'} />
      </TouchableOpacity>
  </View>
)



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'f5f5f5'
  },
  headerContainer: {
    marginBottom: 20,     
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText : {
    fontWeight: 'bold',
    fontSize: 20
  },
  deleteAll: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginEnd: 12
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainerText: {
    fontSize: 18,
    color: '#333'
  },
  todoContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  todoInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 1
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1
  },
  deleteTodo: {
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  todoAddText: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  todoAddButton: {
    backgroundColor: '#fff',
    padding: 11,
    borderRadius: 10,
    marginLeft: 20
  }
})