function openCloseFolder(e) {
	isOpening = e.textContent === '+';
	var oDOMFolderToOpenClose = e.nextElementSibling;
	var iLengthPathFolderToOpenClose = oDOMFolderToOpenClose.id.length;
	var oDOMTreeItemOffspringContainer;
	
	// si le treeItem n'est pas le dernier, il a alors un suivant
	if (e.parentNode.nextElementSibling) {
		oDOMTreeItemOffspringContainer = e.parentNode.nextElementSibling;
		
		//si le suivant est un folder de même niveau on arrête tout car il n'y a rien à ouvrir et on impose un logo '-' 
		if (e.parentNode.nextElementSibling.firstElementChild.nextElementSibling.id.length <= iLengthPathFolderToOpenClose) {
			e.textContent = '-';
			return;
		}
	}
	else {
		return;
	}
	e.textContent = isOpening ? '-' : '+';
	
	// on loop dans les containers des treeItems descendants, c'est à dire tant que la longueur du path est supérieure à celle du folder manipulé
	while (oDOMTreeItemOffspringContainer.firstElementChild.nextElementSibling.id.length > iLengthPathFolderToOpenClose) {
		oDOMTreeItemOffspringContainer.style.display = isOpening ? 'block' : 'none';
		if (oDOMTreeItemOffspringContainer.nextElementSibling) {
			oDOMTreeItemOffspringContainer = oDOMTreeItemOffspringContainer.nextElementSibling;
		}
		else {break;}
	}
}

document.addEventListener('mouseover', function (e) {
	if (e.target.className.includes('treeItem')) {
		var fullTextPathTreeItem = ''; // path to display for user
		var currentTreeItemPathInTree = e.target.id; // path of treeItem in tree
		//alert(currentTreeItemPathInTree)
		while (currentTreeItemPathInTree !== '') {
			fullTextPathTreeItem = '/' + document.getElementById(currentTreeItemPathInTree).innerText + fullTextPathTreeItem;
			currentTreeItemPathInTree = currentTreeItemPathInTree.slice(0,-3);
		}
		e.target.title = fullTextPathTreeItem.slice(1);
	}
}, false);

