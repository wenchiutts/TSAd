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
