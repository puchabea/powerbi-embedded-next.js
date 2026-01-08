# -*- coding: utf-8 -*-
import unittest
import search_algorithm 

# This is only an example, you can structure your tests as you like

class TestBinarySearch(unittest.TestCase):
    def setUp(self):
        """
        Setup data for binary_search testing
        """
        self.data1 = [1, 4, 6, 10, 12, 14, 20]
        self.data2 = [2, 4, 9, 15, 25, 30, 35]
        self.data3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        self.data4 = []
        self.data5 = [1, 3, 5, 7, 9, 11]

    def test_binary_search_1(self):
        """
        Test binary_search with a general case
        """
        self.assertTrue(search_algorithm.binary_search(self.data1, 10))

    def test_binary_search_2(self):
        """
        Test binary_search when element is not found
        """
        self.assertFalse(search_algorithm.binary_search(self.data2, 20))

    def test_binary_search_3(self):
        """
        Test binary_search with first element
        """
        self.assertTrue(search_algorithm.binary_search(self.data3, 1))

    def test_binary_search_4(self):
        """
        Test binary_search with last element
        """
        self.assertTrue(search_algorithm.binary_search(self.data3, 9))

    def test_binary_search_5(self):
        """
        Test binary_search with an empty list
        """
        self.assertFalse(search_algorithm.binary_search(self.data4, 10))


class TestSeqSearch(unittest.TestCase):
    def setUp(self):
        """
        Setup data for seq_search testing
        """
        self.data1 = [1, 4, 6, 10, 12, 14, 20]
        self.data2 = [2, 4, 9, 15, 25, 30, 35]
        self.data3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        self.data4 = []
        self.data5 = [1, 3, 5, 7, 9, 11]

    def test_seq_search_1(self):
        """
        Test seq_search with a general case
        """
        self.assertTrue(search_algorithm.seq_search(self.data1, 10))

    def test_seq_search_2(self):
        """
        Test seq_search when element is not found
        """
        self.assertFalse(search_algorithm.seq_search(self.data2, 20))

    def test_seq_search_3(self):
        """
        Test seq_search with first element
        """
        self.assertTrue(search_algorithm.seq_search(self.data3, 1))

    def test_seq_search_4(self):
        """
        Test seq_search with last element
        """
        self.assertTrue(search_algorithm.seq_search(self.data3, 9))

    def test_seq_search_5(self):
        """
        Test seq_search with an empty list
        """
        self.assertFalse(search_algorithm.seq_search(self.data4, 10))


if __name__ == '__main__':
    unittest.main()
