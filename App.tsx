import React, { useState, FunctionComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Semaphore from './modules/semaphore';
import { Coffee } from './modules/interfaces';
import { timeout } from './modules/functions';
import { CoffeeQueue } from './modules/CoffeeQueue';
const semaphore = new Semaphore(1);
const waitingQueue = new CoffeeQueue();
const coffeeQueue = new CoffeeQueue();
const deliveryQueue = new CoffeeQueue();
const delivered = [] as Coffee[];
const App = () => {

  const coffeeItems = [
    {
      name: 'Cafe Au Lait',
      time: 4000,
    } as Coffee,
    {
      name: 'Cappuccino',
      time: 10000,
    } as Coffee,
    {
      name: 'Espresso',
      time: 15000,
    } as Coffee,
  ];
  const [waitingItems, setWaitingItems] = useState<Coffee[]>([]);
  const [prepareItems, setPrepareItems] = useState<Coffee[]>([]);
  const [counterItems, setCounterItems] = useState<Coffee[]>([]);
  const [deliveredItems, setDeliveredItems] = useState<Coffee[]>([]);

  const renderCoffeeItems = () => {
      return coffeeItems.map((item, index) => {
        return (
          <CoffeeItem key={index} item={item} />
        )
      })
  };

  const renderQueueItems = (items: Coffee[]) => {
    return items.map((item, index) => {
      return (
        <Text key={index}>
          [ {item.name} ]
      </Text>
      )
    })
  };

  interface CoffeeItemProps {
    item: Coffee;
  }
  const CoffeeItem : FunctionComponent<CoffeeItemProps> = (props) => {
    return (
      <TouchableOpacity style={styles.coffeeItem} onPress={()=>{ startProcessing(props.item)}}>
        <Text>
          {props.item.name}
        </Text>
      </TouchableOpacity>
    );
  }


  const startProcessing = (coffee: Coffee) => {
    waitingQueue.enqueue(coffee);
    setWaitingItems([...waitingQueue.items]);
    processCoffee();
  };

  const processCoffee = async () => {
    await semaphore.acquire();
    const coffee = waitingQueue.dequeue();
    setWaitingItems([...waitingQueue.items]);
    coffee && coffeeQueue.enqueue(coffee);
    setPrepareItems([...coffeeQueue.items]);
    await timeout(coffee?.time || 0);
    coffeeQueue.dequeue();
    coffee && deliveryQueue.enqueue(coffee);
    setPrepareItems([...coffeeQueue.items]);
    await semaphore.release();
    processDelivery();
  };

  const processDelivery = async () => {
    setCounterItems([...deliveryQueue.items]);
    await timeout(3000);
    const coffee = deliveryQueue.dequeue()
    coffee && delivered.push(coffee);
    setDeliveredItems([...delivered]);
    setCounterItems([...deliveryQueue.items]);
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.headerText}>Choose a wonderful coffee to drink!</Text>
      {renderCoffeeItems()}
      <View style={styles.section}>
        <Text style={styles.headerText}>Waiting to prepare</Text>
        {renderQueueItems(waitingItems)}
      </View>
      <View style={styles.section}>
        <Text style={styles.headerText}>Preparing</Text>
        {renderQueueItems(prepareItems)}
      </View>
      <View style={styles.section}>
        <Text style={styles.headerText}>Waiting to be picked up</Text>
        {renderQueueItems(counterItems)}
      </View>
      <View style={styles.section}>
        <Text style={styles.headerText}>Delivered</Text>
        {renderQueueItems(deliveredItems)}
      </View>
    </View>
    </ScrollView>

  );
}
export default App;

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18
  },
  coffeeItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
});
