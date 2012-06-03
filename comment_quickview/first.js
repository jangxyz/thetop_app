/*
0. --(load jQuery)--
daum already has jQuery

1. fetch list page data


get list url from representative home url


get extract comment view page 
{
    representative url: 'http://cafe.daum.net/loveclimb',
    inner home url    : 'http://cafe986.daum.net/_c21_/home?grpid=ccJT',
    list  url         : ,
    article url       : 'http://cafe.daum.net/loveclimb/_album/4699',
    comment view url  : 'http://cafe986.daum.net/_c21_/shortcomment_read?grpid=ccJT&fldid=_album&dataid=4699',
}

*/



function fetchListPage() {
    var homeUrl = getInnerHomeUrl();
    $.get(homUrl);
}


console.log("testing...");
function TEST() {
    var homeUrl = getInnerHomeUrl();
    document.domain = 'cafe986.daum.net';
    $.get(homeUrl);
};
TEST();
console.log("test done.");


/* 
 * http://cafe.daum.net/loveclimb => http://cafe986.daum.net/_c21_/home?grpid=ccJT
 */
function getInnerHomeUrl() {
    var homeUrl = $('frame#down')[0].getAttribute('src');
    return homeUrl;
}


/*
 * http://cafe.daum.net/loveclimb/_album/4699 => http://cafe986.daum.net/_c21_/shortcomment_read?grpid=ccJT&fldid=_album&dataid=4699
 */
function getCommentViewUrl(articleUrl) {
    var homeUrl   = getInnerHomeUrl();        // http://cafe986.daum.net/_c21_/home?grpid=ccJT
    var subdomain = getSubdomain(homeUrl);    // cafe986
    var grpid     = getGroupid(homeUrl);      // ccJT
    var fldid     = getFldid(articleUrl);     // _album
    var dataid    = getDataid(articleUrl);    // 4699

    return 'http://' + subdomain + '.daum.net/_c21_/shortcomment_read?grpid=' + grpid + '&fldid=' + fldid + '&dataid=' + dataid;
}

/*
 *
 * http://cafe986.daum.net/_c21_/home?grpid=ccJT => ccJT
 *
 */
function getGroupid(url) {
    var url = url.trim();
    if (url.indexOf('?') == -1) {
        return undefined;
    }
    var keyValuePairs = url.split('?')[1].split('&');
    for (var i=0; i<keyValuePairs.length; i++) {
        console.log(keyValuePairs[i]);
        var kv = keyValuePairs[i].split('=');
        if (kv[0] == 'grpid') {
            return kv[1];
        }
    }
}

/*
 * http://cafe.daum.net/loveclimb/_album/4699 => _album
 */
function getFldid(articleUrl) {
    return getPathFromUrl(articleUrl).split('/')[1];
}

function getDataid(articleUrl) {
    return getPathFromUrl(articleUrl).split('/')[2];
}

//
//
//
function getPathFromUrl(url) {
    var path = splitUrl(articleUrl)[2]; // [protocol, domain, path, queryString]
    if (path[0] == '/') {
        path = path.substr(1);
    }
    return path;
}

/*
 * split url into list of [protocol, domain, path, queryString]
 * 
 * ex) 
 *  http://cafe986.daum.net/_c21_/shortcomment_read?grpid=ccJT&fldid=_album&dataid=4699
 *  => ['http', 'cafe986.daum.net', '_c21_/shortcomment_read', 'grpid=ccJT&fldid=_album&dataid=4699']
 */
function splitUrl(url) {
    var url = url.trim();
     
    // convert: \ => /
    url = url.replace(/\\/g,"/");
     
    // protocol
    var protocol = 'http://';
    var match = url.match(/^(http|https|ftp)\:\/\/(.*)/i);
    if (match) {
        protocol = match[1];
        url      = match[2];
    } 

    // query string
    match = url.match(/(.*)[?](.*)$/);
    var queryString = '';
    if (match) {
        url         = match[1];
        queryString = match[2];
    }

    // path
    match = url.match(/([^\/]*)\/(.*)/);
    domain = url;
    path   = '';
    if (match) {
        domain = match[1];
        path   = match[2];
    }

    return [protocol, domain, path, queryString];
}

function getSubdomain(url) {
    var url = url.trim();
     
    // convert: \ => /
    url = url.replace(/\\/g,"/");
     
    // strip protocol: http://
    url = url.replace(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i, "");
    // strip starting 'www.'
    url = url.replace(/^www\./i, "");
    // remove following path
    url = url.replace(/\/(.*)/, "");
     
    // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
    url = url.replace(/\.[a-z]{2,3}\.[a-z]{2}$/i, "");
    // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
    url = url.replace(/\.[a-z]{2,4}$/i, "");
     
    // get first (.*)[.]
    if (url.indexOf('.') != -1) {
        return url.replace(/^([^.]*)[.].*/, "$1");
    } else {
        return ''
    }
}


