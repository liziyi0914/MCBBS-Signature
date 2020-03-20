
function BasicLayout(props) {
  return (
    <div>
	  <h1 style={{textAlign:'center'}}>MCBBS签名档制作器</h1>
	  <h5 style={{textAlign:'center'}}>by <a href='https://liziyi0914.com'>liziyi0914</a></h5>
      {props.children}
    </div>
  );
}

export default BasicLayout;
