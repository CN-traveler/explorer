<?php

    exit(json_encode(getInfo('repository')));

    function getInfo($dir) {
        $result = array();
        $result['param'] = getParam($dir);
        if(is_dir($dir)) {
            $result['children'] = array();
            if($open = opendir($dir)){
                while (($name = readdir($open))!= false){
                    if($name == '.' || $name == '..') {
                        continue;
                    }
                    array_push($result['children'], getInfo($dir . '/' . $name));
                }
                closedir($open);
            }
        }
        return $result;
    }

    function getParam($dir) {
        $dirArray = explode('/', $dir);
        foreach($dirArray as $k => $v) {
            $dirArray[$k] = urlencode($v);
        }
        return array(
            'name' => urldecode(end($dirArray)),
            'path' => implode('/', $dirArray)
        );
    }

?>