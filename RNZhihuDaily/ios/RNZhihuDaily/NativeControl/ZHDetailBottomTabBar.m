//
//  ZHDetailBottomTabBar.m
//  RNZhihuDaily
//
//  Created by 郝 林巍 on 16/5/30.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "ZHDetailBottomTabBar.h"

//@interface ZHDetailBottomTabBar : RCTViewManager
//@end

#define kDeviceW ([UIScreen mainScreen].bounds.size.width)
#define kDeviceH ([UIScreen mainScreen].bounds.size.height)

@interface ZHDetailBottomTabBar ()

@property (nonatomic, strong) NSMutableArray *itemsList;

@end

@implementation ZHDetailBottomTabBar

- (id)init {
  self = [super initWithFrame:CGRectMake(0.f, 0.f, kDeviceW, 44)];
  if (self) {
    self.backgroundColor = [UIColor grayColor];
    self.itemsList = [[NSMutableArray alloc] init];
  }
  return self;
}

- (void)setItemsNum:(NSInteger)itemsNum {
  _itemsNum = itemsNum;
  if (itemsNum > 0) {
    [self removeAllSubviews];
    [self.itemsList removeAllObjects];
    for (int i = 0; i < itemsNum; ++i) {
      UILabel *label1 = [UILabel new];
      label1.textColor = [UIColor blackColor];
      label1.font = [UIFont systemFontOfSize:15];
      [label1 setText:[NSString stringWithFormat:@"%d", i]];
      [label1 sizeToFit];
      label1.center = CGPointMake(self.tabBarWidth / (itemsNum * 2) * (i * 2 + 1), 22);
      [self addSubview:label1];
      [self.itemsList addObject:label1];
    }
  }
}

- (void)setTabBarWidth:(NSInteger)tabBarWidth {
  _tabBarWidth = tabBarWidth;
  self.frame = CGRectMake(self.frame.origin.x, self.frame.origin.y, tabBarWidth, self.frame.size.height);
  if (_tabBarWidth > 0) {
    for (int i = 0; i < self.itemsList.count; ++i) {
      UILabel *label = (UILabel *)[self.itemsList objectAtIndex:i];
      label.center = CGPointMake(self.frame.size.width / (self.itemsList.count * 2) * (i * 2 + 1), 22);
    }
  }
}
- (void)removeAllSubviews
{
  for (UIView *view in self.subviews) {
    [view removeFromSuperview];
  }
}

@end
