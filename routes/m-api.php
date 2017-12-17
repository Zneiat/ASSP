<?php

use Illuminate\Http\Request;
use Metowolf\Meting;

/** @var $router Laravel\Lumen\Routing\Router */
$router->get('/m-api', function (Request $request) use ($router) {
    $_site = $request->get('site');
    $_action = $request->get('action');
    $_id = $request->get('id');
    $_site = in_array($_site, [
        'netease', 'tencent', 'xiami', 'kugou', 'baidu'
    ]) ? $_site : 'netease';
    $_api = (new Meting($_site))->format(true);
    
    switch ($_action) {
        case 'search':
            $keyword = $request->get('keyword');
            $page = intval($request->get('page', '1'));
            $limit = intval($request->get('limit', '30'));
            if (empty($keyword)) return response()->json([]);
            
            $result = $_api->search($keyword, $page, $limit);
            /*foreach ($result as $i => $item) {
                $result[$i]['audio_url'] = '';
            }*/
            break;
        
        case 'song_info':
            $result = $_api->song($_id);
            break;
            
        case 'song_full':
            $song = json_decode($_api->song($_id), true, 512, JSON_BIGINT_AS_STRING)[0];
            
            if (!empty($song['url_id']))
                $song['song_src'] = json_decode($_api->url($song['url_id']));
    
            if (!empty($song['lyric_id']))
                $song['song_lrc'] = json_decode($_api->lyric($song['lyric_id']));
    
            if (!empty($song['pic_id']))
                $song['song_pic'] = json_decode($_api->pic($song['pic_id']));
            
            $result = json_encode($song);
            
            break;
        
        case 'song_src':
            $result = $_api->url($_id);
            break;
        
        case 'song_lrc':
            $result = $_api->lyric($_id);
            break;
            
        case 'song_pic':
            $size = intval($request->get('size', '300'));
            $result = $_api->pic($_id, $size);
            break;
            
        case 'album':
            $result = $_api->album($_id);
            break;
    
        case 'artist':
            $limit = intval($request->get('limit', '50'));
            $result = $_api->artist($_id, $limit);
    }
    
    return response()->json(isset($result) ? json_decode($result) : ['msg' => '黑人问号']);
});