<?php
$saveFile = 'down/';
$imgurl = $_POST['img'];
$img = base64_decode($imgurl);
$t = time().'.jpg';
$save = file_put_contents('../down/'.$t,$img);
if($save)
echo '保存成功';
