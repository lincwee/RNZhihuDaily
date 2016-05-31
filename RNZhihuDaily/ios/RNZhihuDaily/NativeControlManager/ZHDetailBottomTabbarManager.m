//
//  ZHDetailBottomTabbarManager.m
//  RNZhihuDaily
//
//  Created by 郝 林巍 on 16/5/31.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "ZHDetailBottomTabbarManager.h"
#import "ZHDetailBottomTabBar.h"
#import "RCTView.h"

@implementation ZHDetailBottomTabbarManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  return [ZHDetailBottomTabBar new];
}

RCT_CUSTOM_VIEW_PROPERTY(tabBarWidth, CGFloat, ZHDetailBottomTabBar)
{
  CGFloat width = json ? [RCTConvert CGFloat:json] : defaultView.frame.size.width;
  view.tabBarWidth = width;
}

RCT_CUSTOM_VIEW_PROPERTY(itemsNum, NSInteger, ZHDetailBottomTabBar)
{
  CGFloat num = json ? [RCTConvert NSInteger:json] : defaultView.itemsNum;
  view.itemsNum = num;
}

@end
