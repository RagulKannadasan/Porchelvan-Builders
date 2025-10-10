<?php
$a=$_POST["n"];
$b=$_POST["p"];
$c=$_POST["e"];
$d=$_POST["l"];
$e=$_POST["proj"];
$f=$_POST["deta"];
$con=mysql_connect("localhost","root","");
mysql_select_db("balaji");
mysql_query("Insert into boys(n,p,e,l,proj,deta)values('$a','$b','$c','$d','$e','$f')");
echo("THANKS FOR REGISTER!!!!!!!");
include("register.php");
mysql_close($con);
?>