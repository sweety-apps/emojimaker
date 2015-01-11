//
//  main.m
//  ImagePreloadFilesAdder
//
//  Created by Lee Justin on 15/1/11.
//  Copyright (c) 2015年 baygun technology Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import <NSJSONSerialization.h>

/////////使用时修改下面三个宏
//图片目录
#define kSrcImageDir @"/Users/leejustin/Documents/SourceCode/GitHub/wangcai/wangcai_svr/web/emoji/web/img"
//拼入的子目录前缀
#define kDestPathPrefix @"img/"
//配置文件目录
#define kDestJsonPath @"/Users/leejustin/Documents/SourceCode/GitHub/wangcai/wangcai_svr/web/emoji/web/config/files2.json"
//////////////////////////


NSString* getTypeWithFileName(NSString* fileName)
{
    if ([fileName rangeOfString:@".jpg"].length > 0
        || [fileName rangeOfString:@".png"].length > 0
        || [fileName rangeOfString:@".gif"].length > 0
        )
    {
        return @"IMAGE";
    }
    else if ([fileName rangeOfString:@".js"].length > 0
             )
    {
        return @"SCRIPT";
    }
    else if ([fileName rangeOfString:@".css"].length > 0
             )
    {
        return @"CSS";
    }
    else if ([fileName rangeOfString:@".webm"].length > 0
             || [fileName rangeOfString:@".mov"].length > 0
             || [fileName rangeOfString:@".mp4"].length > 0
             || [fileName rangeOfString:@".ogv"].length > 0
             || [fileName rangeOfString:@".flv"].length > 0
             || [fileName rangeOfString:@".m4v"].length > 0
             || [fileName rangeOfString:@".ts"].length > 0
             )
    {
        return @"VIDEO";
    }
    else if ([fileName rangeOfString:@".mp3"].length > 0
             || [fileName rangeOfString:@".ogg"].length > 0
             || [fileName rangeOfString:@".aac"].length > 0
             )
    {
        return @"IMAGE";
    }
    return @"";
}

void doAdd()
{
    NSMutableDictionary* dstDict = [NSMutableDictionary dictionary];
    NSMutableArray* dstArr = [NSMutableArray array];
    NSArray* fileArray = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:kSrcImageDir error:nil];
    for (NSString* fileName in fileArray)
    {
        NSMutableDictionary* item = [NSMutableDictionary dictionary];
        NSString* type = getTypeWithFileName(fileName);
        if ([type length] > 0)
        {
            item[@"type"] = type;
            item[@"source"] = [kDestPathPrefix stringByAppendingString:fileName];
            NSString* imageFilePath = [kSrcImageDir stringByAppendingFormat:@"/%@",fileName];
            
            NSDictionary *attr = [[NSFileManager defaultManager] attributesOfItemAtPath:imageFilePath error:nil];
            item[@"size"] = [attr objectForKey:NSFileSize];
            
            [dstArr addObject:item];
        }
    }
    dstDict[@"files"] = dstArr;
    NSData* jsonData = [NSJSONSerialization dataWithJSONObject:dstDict options:0 error:nil];
    NSString* jsonStr = [NSString stringWithUTF8String:[jsonData bytes]];
    [jsonStr writeToFile:kDestJsonPath atomically:YES encoding:NSUTF8StringEncoding error:nil];
}

int main(int argc, const char * argv[])
{
    
    @autoreleasepool {
        
        // insert code here...
        NSLog(@"Start Adding");
        doAdd();
        NSLog(@"Finished");
    }
    return 0;
}
