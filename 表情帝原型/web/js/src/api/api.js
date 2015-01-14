/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 14/12/22
 * Time: 下午1:33
 * To change this template use File | Settings | File Templates.
 */

//base url
var host = ".";
var url_api = host+"api/";
var api_appendix = ".json";

//api url
var url_get_templete = url_api+"get_templete"+api_appendix;
var url_get_templete_category = url_api+"get_templete_category"+api_appendix;
var url_get_templete_list = url_api+"get_templete_list"+api_appendix;
var url_get_picture_category = url_api+"get_picture_category"+api_appendix;
var url_get_picture_list = url_api+"get_picture_list"+api_appendix;
var url_upload_picture = url_api+"upload_picture"+api_appendix;
var url_generate_templete = url_api+"generate_templete"+api_appendix;

function request_templete(callback)
{
    $.get(url_generate_templete);
}