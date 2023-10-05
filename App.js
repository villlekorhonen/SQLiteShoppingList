import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Keyboard, FlatList, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('listdb.db');

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists list (id integer primary key not null, amount text, product text);');
    }, null, updateList); 
  }, []);

  // Save course
  const saveItem = () => {
    console.log('Tallennetaan kohde:', amount, product);
    db.transaction(tx => {
        tx.executeSql('insert into list (amount, product) values (?, ?);', [amount, product], (_, result) => {
          console.log('insert result:', result);
          Keyboard.dismiss();
    });    
      }, null, updateList);
    
  }

  // Update courselist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from list;', [], (_, { rows }) => {
      console.log('Select result:' ,rows._array);
        setList(rows._array);
    }); 
    });
  }

  // Delete course
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from list where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      <TextInput placeholder='Product' style={styles.input}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={styles.input}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <TouchableOpacity style={styles.button} onPress={saveItem} title="Save">
        <Text style={styles.text}>Save</Text>
        </TouchableOpacity>  
      <Text style={styles.text}>List of items</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 25, fontWeight: '500', marginTop: 5,}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 25,marginTop: 5, backgroundColor: 'tomato', color: 'white', borderRadius: 10, textAlign: 'center', alignItems:'center',}} onPress={() => deleteItem(item.id)}> Bought</Text></View>} 
        data={list} 
        
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'wheat',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: 'wheat',
  alignItems: 'center',
  fontSize: 25,
 },
 input: {
  marginTop: 10,
  fontSize: 16,
  fontWeight: '700',
  width: '50%',
  height: '7%',
  borderColor: 'black',
  borderWidth: 3,
  textAlign: 'center',
  backgroundColor: 'gold'
},
  button: {
    justifyContent: 'center',
    height: 50,
    width: '60%',
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 3,
    backgroundColor: 'seagreen',
    borderRadius: 40,
    marginBottom: 20,

  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign:'center',
  },
  list: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    marginTop: 20,
    marginBottom: 10
  },
  header: {
    fontSize: 30,
    marginTop: 35,
    fontWeight: 'bold',
    backgroundColor: 'black',
    borderColor: 'black',
    borderRadius: 15,
    color: 'white',
    width: '80%',
    height: '7%',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20
  }

  
});