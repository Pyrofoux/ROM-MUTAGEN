function rand(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get(id)
{
	return document.getElementById(id)
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
