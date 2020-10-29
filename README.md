# TSAd

#### 在新的project引入TSAd

```
(Option) git remote add TSAd git@github.com:wenchiutts/TSAd.git
git subtree add --prefix src/modules/Ads TSAd master
```

#### 如果有修改到TSAd，更新遠端內容
```
git subtree push --prefix src/modules/Ads TSAd master
```

#### 更新project中的TSAd
```
git subtree pull --prefix src/modules/Ads
```

#### 使用
在App.js加入，放在一個mode=modal的navigator底下
```
<Stack.Navigator mode="modal" >
   <Stack.Screen
      name="fullScreenAd"
      component={TSAdFullScreen}
      options={{ headerShown: false }}
   />
</Stack.Navigator>
```
在navigate的時候，利用params傳入需要的資料
```
<Button
  title="test ad"
  onPress={() =>
    navigation.navigate('fullScreenAd', {
      mediaSource: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      iconSource: require('/assets/icon.png'),
      linkUrl:
        'https://play.google.com/store/apps/details?id=com.ins.reports.analyzer.insta.followers.tracker',
    })
  }
/>
````
