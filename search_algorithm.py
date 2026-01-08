# -*- coding: utf-8 -*-
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return True  # Devuelve el índice del elemento encontrado
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return False

def seq_search(array, x):
	for element in array:
		if element == x:
			return True
	return False
