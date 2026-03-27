const problems2 = [
  // ─── GRAPHS (continued) ────────────────────────────────────────────────────
  {
    title: "Course Schedule",
    difficulty: "medium",
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.\n\nReturn \`true\` if you can finish all courses. Otherwise, return \`false\`.\n\n**Constraints:**\n- 1 <= numCourses <= 2000\n- 0 <= prerequisites.length <= 5000`,
    sampleInput: "numCourses = 2, prerequisites = [[1,0]]",
    sampleOutput: "true",
    testCases: [
      { input: "2\n1 0", output: "true", isHidden: false },
      { input: "2\n1 0\n0 1", output: "false", isHidden: false },
      { input: "1\n", output: "true", isHidden: true },
    ],
  },
  {
    title: "Pacific Atlantic Water Flow",
    difficulty: "medium",
    description: `There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nGiven an m x n integer matrix \`heights\`, return a list of coordinates where rain water can flow to both the Pacific and Atlantic oceans.\n\n**Constraints:**\n- m == heights.length\n- n == heights[r].length\n- 1 <= m, n <= 200\n- 0 <= heights[i][j] <= 10^5`,
    sampleInput: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
    sampleOutput: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
    testCases: [
      { input: "5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4", output: "0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0", isHidden: false },
      { input: "1 1\n1", output: "0 0", isHidden: false },
      { input: "2 2\n3 1\n1 3", output: "0 0\n1 1", isHidden: true },
    ],
  },
  // ─── BINARY SEARCH ─────────────────────────────────────────────────────────
  {
    title: "Binary Search",
    difficulty: "easy",
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\n**Constraints:**\n- 1 <= nums.length <= 10^4\n- -10^4 < nums[i], target < 10^4\n- All the integers in nums are unique.\n- nums is sorted in ascending order.`,
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    sampleOutput: "4",
    testCases: [
      { input: "-1 0 3 5 9 12\n9", output: "4", isHidden: false },
      { input: "-1 0 3 5 9 12\n2", output: "-1", isHidden: false },
      { input: "5\n5", output: "0", isHidden: true },
    ],
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    description: `Suppose an array of length \`n\` sorted in ascending order is rotated between 1 and n times.\n\nGiven the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.\n\n**Constraints:**\n- n == nums.length\n- 1 <= n <= 5000\n- -5000 <= nums[i] <= 5000\n- All the integers of nums are unique.`,
    sampleInput: "nums = [3,4,5,1,2]",
    sampleOutput: "1",
    testCases: [
      { input: "3 4 5 1 2", output: "1", isHidden: false },
      { input: "4 5 6 7 0 1 2", output: "0", isHidden: false },
      { input: "11 13 15 17", output: "11", isHidden: true },
    ],
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    description: `Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\n**Constraints:**\n- 1 <= nums.length <= 5000\n- -10^4 <= nums[i] <= 10^4\n- All values of nums are unique.`,
    sampleInput: "nums = [4,5,6,7,0,1,2], target = 0",
    sampleOutput: "4",
    testCases: [
      { input: "4 5 6 7 0 1 2\n0", output: "4", isHidden: false },
      { input: "4 5 6 7 0 1 2\n3", output: "-1", isHidden: false },
      { input: "1\n0", output: "-1", isHidden: true },
    ],
  },
  // ─── STACK & QUEUE ─────────────────────────────────────────────────────────
  {
    title: "Valid Parentheses",
    difficulty: "easy",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.\n\n**Constraints:**\n- 1 <= s.length <= 10^4\n- s consists of parentheses only \`'()[]{}'\`.`,
    sampleInput: 's = "()"',
    sampleOutput: "true",
    testCases: [
      { input: "()", output: "true", isHidden: false },
      { input: "()[]{}", output: "true", isHidden: false },
      { input: "(]", output: "false", isHidden: true },
    ],
  },
  {
    title: "Min Stack",
    difficulty: "medium",
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the \`MinStack\` class:\n- \`MinStack()\` initializes the stack object.\n- \`void push(int val)\` pushes the element val onto the stack.\n- \`void pop()\` removes the element on the top of the stack.\n- \`int top()\` gets the top element of the stack.\n- \`int getMin()\` retrieves the minimum element in the stack.\n\nAll operations must run in O(1) time.\n\n**Constraints:**\n- -2^31 <= val <= 2^31 - 1`,
    sampleInput: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
    sampleOutput: "[null,null,null,null,-3,null,0,-2]",
    testCases: [
      { input: "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", output: "-3\n0\n-2", isHidden: false },
      { input: "push 5\ngetMin\npush 3\ngetMin", output: "5\n3", isHidden: false },
      { input: "push 1\npush 2\ngetMin\npop\ngetMin", output: "1\n1", isHidden: true },
    ],
  },
  // ─── HEAP / PRIORITY QUEUE ─────────────────────────────────────────────────
  {
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`th largest element in the array.\n\nNote that it is the \`k\`th largest element in the sorted order, not the \`k\`th distinct element.\n\nCan you solve it without sorting?\n\n**Constraints:**\n- 1 <= k <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4`,
    sampleInput: "nums = [3,2,1,5,6,4], k = 2",
    sampleOutput: "5",
    testCases: [
      { input: "3 2 1 5 6 4\n2", output: "5", isHidden: false },
      { input: "3 2 3 1 2 4 5 5 6\n4", output: "4", isHidden: false },
      { input: "1\n1", output: "1", isHidden: true },
    ],
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "medium",
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.\n\n**Constraints:**\n- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4\n- k is in the range [1, the number of unique elements in the array].`,
    sampleInput: "nums = [1,1,1,2,2,3], k = 2",
    sampleOutput: "[1,2]",
    testCases: [
      { input: "1 1 1 2 2 3\n2", output: "1 2", isHidden: false },
      { input: "1\n1", output: "1", isHidden: false },
      { input: "4 1 1 2 2 3\n2", output: "1 2", isHidden: true },
    ],
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "hard",
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\n**Constraints:**\n- k == lists.length\n- 0 <= k <= 10^4\n- 0 <= lists[i].length <= 500\n- -10^4 <= lists[i][j] <= 10^4\n- lists[i] is sorted in ascending order.`,
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,3,4,4,5,6]",
    testCases: [
      { input: "1 4 5\n1 3 4\n2 6", output: "1 1 2 3 4 4 5 6", isHidden: false },
      { input: "", output: "", isHidden: false },
      { input: "", output: "", isHidden: true },
    ],
  },
  // ─── BACKTRACKING ──────────────────────────────────────────────────────────
  {
    title: "Combination Sum",
    difficulty: "medium",
    description: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.\n\nThe same number may be chosen from candidates an unlimited number of times.\n\n**Constraints:**\n- 1 <= candidates.length <= 30\n- 2 <= candidates[i] <= 40\n- All elements of candidates are distinct.\n- 1 <= target <= 40`,
    sampleInput: "candidates = [2,3,6,7], target = 7",
    sampleOutput: "[[2,2,3],[7]]",
    testCases: [
      { input: "2 3 6 7\n7", output: "2 2 3\n7", isHidden: false },
      { input: "2 3 5\n8", output: "2 2 2 2\n2 3 3\n3 5", isHidden: false },
      { input: "2\n1", output: "", isHidden: true },
    ],
  },
  {
    title: "Word Search",
    difficulty: "medium",
    description: `Given an m x n grid of characters \`board\` and a string \`word\`, return \`true\` if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.\n\n**Constraints:**\n- m == board.length\n- n == board[i].length\n- 1 <= m, n <= 6\n- 1 <= word.length <= 15\n- board and word consist of only lowercase and uppercase English letters.`,
    sampleInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
    sampleOutput: "true",
    testCases: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "true", isHidden: false },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", output: "true", isHidden: false },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", output: "false", isHidden: true },
    ],
  },
  {
    title: "Subsets",
    difficulty: "medium",
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.\n\n**Constraints:**\n- 1 <= nums.length <= 10\n- -10 <= nums[i] <= 10\n- All the numbers of nums are unique.`,
    sampleInput: "nums = [1,2,3]",
    sampleOutput: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
    testCases: [
      { input: "1 2 3", output: "\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3", isHidden: false },
      { input: "0", output: "\n0", isHidden: false },
      { input: "1 2", output: "\n1\n2\n1 2", isHidden: true },
    ],
  },
  // ─── HARD PROBLEMS ─────────────────────────────────────────────────────────
  {
    title: "Trapping Rain Water",
    difficulty: "hard",
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n**Constraints:**\n- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5`,
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",
    testCases: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6", isHidden: false },
      { input: "4 2 0 3 2 5", output: "9", isHidden: false },
      { input: "1 0 1", output: "1", isHidden: true },
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\n**Constraints:**\n- nums1.length == m\n- nums2.length == n\n- 0 <= m <= 1000\n- 0 <= n <= 1000\n- 1 <= m + n <= 2000\n- -10^6 <= nums1[i], nums2[i] <= 10^6`,
    sampleInput: "nums1 = [1,3], nums2 = [2]",
    sampleOutput: "2.00000",
    testCases: [
      { input: "1 3\n2", output: "2.00000", isHidden: false },
      { input: "1 2\n3 4", output: "2.50000", isHidden: false },
      { input: "0 0\n0 0", output: "0.00000", isHidden: true },
    ],
  },
  {
    title: "Word Ladder",
    difficulty: "hard",
    description: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that every adjacent pair differs by a single letter and every word in the sequence is in the dictionary.\n\nGiven two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the number of words in the shortest transformation sequence from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.\n\n**Constraints:**\n- 1 <= beginWord.length <= 10\n- endWord.length == beginWord.length\n- 1 <= wordList.length <= 5000`,
    sampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
    sampleOutput: "5",
    testCases: [
      { input: "hit cog\nhot dot dog lot log cog", output: "5", isHidden: false },
      { input: "hit cog\nhot dot dog lot log", output: "0", isHidden: false },
      { input: "hit hot\nhot", output: "2", isHidden: true },
    ],
  },
  // ─── TWO POINTERS ──────────────────────────────────────────────────────────
  {
    title: "Container With Most Water",
    difficulty: "medium",
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\n**Constraints:**\n- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4`,
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]",
    sampleOutput: "49",
    testCases: [
      { input: "1 8 6 2 5 4 8 3 7", output: "49", isHidden: false },
      { input: "1 1", output: "1", isHidden: false },
      { input: "4 3 2 1 4", output: "16", isHidden: true },
    ],
  },
  {
    title: "Move Zeroes",
    difficulty: "easy",
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.\n\n**Constraints:**\n- 1 <= nums.length <= 10^4\n- -2^31 <= nums[i] <= 2^31 - 1`,
    sampleInput: "nums = [0,1,0,3,12]",
    sampleOutput: "[1,3,12,0,0]",
    testCases: [
      { input: "0 1 0 3 12", output: "1 3 12 0 0", isHidden: false },
      { input: "0", output: "0", isHidden: false },
      { input: "1 0 1", output: "1 1 0", isHidden: true },
    ],
  },
  // ─── HASH MAP ──────────────────────────────────────────────────────────────
  {
    title: "Longest Consecutive Sequence",
    difficulty: "medium",
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.\n\n**Constraints:**\n- 0 <= nums.length <= 10^5\n- -10^9 <= nums[i] <= 10^9`,
    sampleInput: "nums = [100,4,200,1,3,2]",
    sampleOutput: "4",
    testCases: [
      { input: "100 4 200 1 3 2", output: "4", isHidden: false },
      { input: "0 3 7 2 5 8 4 6 0 1", output: "9", isHidden: false },
      { input: "", output: "0", isHidden: true },
    ],
  },
  // ─── MATRIX ────────────────────────────────────────────────────────────────
  {
    title: "Set Matrix Zeroes",
    difficulty: "medium",
    description: `Given an m x n integer matrix \`matrix\`, if an element is 0, set its entire row and column to 0's.\n\nYou must do it in place.\n\n**Constraints:**\n- m == matrix.length\n- n == matrix[0].length\n- 1 <= m, n <= 200\n- -2^31 <= matrix[i][j] <= 2^31 - 1`,
    sampleInput: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
    sampleOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
    testCases: [
      { input: "3 3\n1 1 1\n1 0 1\n1 1 1", output: "1 0 1\n0 0 0\n1 0 1", isHidden: false },
      { input: "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5", output: "0 0 0 0\n0 4 5 0\n0 3 1 0", isHidden: false },
      { input: "2 2\n0 1\n1 0", output: "0 0\n0 0", isHidden: true },
    ],
  },
  {
    title: "Rotate Image",
    difficulty: "medium",
    description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.\n\n**Constraints:**\n- n == matrix.length == matrix[i].length\n- 1 <= n <= 20\n- -1000 <= matrix[i][j] <= 1000`,
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    sampleOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", isHidden: false },
      { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", output: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11", isHidden: false },
      { input: "1\n1", output: "1", isHidden: true },
    ],
  },
  // ─── INTERVALS ─────────────────────────────────────────────────────────────
  {
    title: "Merge Intervals",
    difficulty: "medium",
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\n**Constraints:**\n- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= starti <= endi <= 10^4`,
    sampleInput: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
    sampleOutput: "[[1,6],[8,10],[15,18]]",
    testCases: [
      { input: "1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18", isHidden: false },
      { input: "1 4\n4 5", output: "1 5", isHidden: false },
      { input: "1 4\n0 0", output: "0 0\n1 4", isHidden: true },
    ],
  },
  {
    title: "Non-overlapping Intervals",
    difficulty: "medium",
    description: `Given an array of intervals \`intervals\` where \`intervals[i] = [starti, endi]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\n**Constraints:**\n- 1 <= intervals.length <= 10^5\n- intervals[i].length == 2\n- -5 * 10^4 <= starti < endi <= 5 * 10^4`,
    sampleInput: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
    sampleOutput: "1",
    testCases: [
      { input: "1 2\n2 3\n3 4\n1 3", output: "1", isHidden: false },
      { input: "1 2\n1 2\n1 2", output: "2", isHidden: false },
      { input: "1 2\n2 3", output: "0", isHidden: true },
    ],
  },
  // ─── TRIE ──────────────────────────────────────────────────────────────────
  {
    title: "Implement Trie (Prefix Tree)",
    difficulty: "medium",
    description: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.\n\nImplement the Trie class:\n- \`Trie()\` Initializes the trie object.\n- \`void insert(String word)\` Inserts the string word into the trie.\n- \`boolean search(String word)\` Returns true if the string word is in the trie, and false otherwise.\n- \`boolean startsWith(String prefix)\` Returns true if there is a previously inserted string that has the prefix prefix, and false otherwise.\n\n**Constraints:**\n- 1 <= word.length, prefix.length <= 2000\n- word and prefix consist only of lowercase English letters.`,
    sampleInput: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',
    sampleOutput: "[null,null,true,false,true,null,true]",
    testCases: [
      { input: "insert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app\nsearch app", output: "true\nfalse\ntrue\ntrue", isHidden: false },
      { input: "insert ab\nstartsWith a\nsearch a", output: "true\nfalse", isHidden: false },
      { input: "insert xyz\nsearch xyz\nsearch xy\nstartsWith xy", output: "true\nfalse\ntrue", isHidden: true },
    ],
  },
];

module.exports = problems2;
