var React = require('react');

var data = require('./data');

var W = 160;

var imgStyle = {
    width: W +'px',
    height: 'auto'
};

function getOffset(el, end){
    if(end === undefined){
        end = document.body;
    }
    var top = 0;
    var left = 0;
    while( true ){
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent;
        if(el === end){
            return {
                top: top,
                left: left
            };
        }
    }
    return false;
}


var Person = React.createClass({
    getInitialState: function(){
        return {
            curPhoto: this.props.data.photos[0]
        };
    },
    componentDidMount: function() {
        // 预加载所有photo, 方便待会的切换
        this.preLoadPhoto();

        var img = this.refs['photo'].getDOMNode();
        this.imgOffset = getOffset(img);

        window.addEventListener('resize', function(){
            this.imgOffset = getOffset(img);
        });
    },
    render: function(){
        var person = this.props.data;
        var srcPrefix = this.props.srcPrefix;
        return (
            <article className="person">
                <img className="photo" src={ srcPrefix + this.state.curPhoto}
                    style={imgStyle}
                    ref="photo"
                    onMouseMove = {this._mouseEnter}
                    onMouseLeave = {this._mouseLeave}
                />
                <p className="name">{person.name}</p>
            </article>
        );
    },
    _mouseEnter: function(e){
        var pageX = e.pageX;
        var delta = pageX - this.imgOffset.left;
        var n = Math.floor( delta/(W/4) );

        if( n !== this.state.curPhoto ){
            this.changePhoto(n);
        }
    },
    _mouseLeave: function(e){
        // 鼠标离开 换回最开始的图片
        this.changePhoto(0);
    },
    changePhoto: function(index){
        this.setState({
            curPhoto: this.props.data.photos[index]
        });
    },
    preLoadPhoto: function(){
        var self = this;
        // 预加载所有图片
        var img = document.createElement('img');
        img.style.height = 0;
        img.style.width = 0;
        img.style.overflow = 'hidden';
        document.body.appendChild(img);
        var curIndex = 0;
        var photos = this.props.data.photos;
        img.onload = function(){
            curIndex++;
            if( curIndex < photos.length){
                img.src = self.props.srcPrefix + self.props.data.photos[curIndex];
            }
            else{
                img.remove();
            }
        }
        img.src= this.props.srcPrefix + this.props.data.photos[curIndex];
    }
});

var Team = React.createClass({
    render: function(){
        var self = this;
        var data = this.props.people;
        var nodes = data.map(function(p, i){
            return <Person data={p} key={p.name} srcPrefix={ self.props.srcPrefix }/>;
        });

        return <div className="people">{nodes}</div>;
    }
});

var App = React.createClass({
    render: function(){
        return <Team people={this.props.data} srcPrefix={'./img/'}/>;
    }
});


React.render(<App data={data} />, document.querySelector('#ctn'));