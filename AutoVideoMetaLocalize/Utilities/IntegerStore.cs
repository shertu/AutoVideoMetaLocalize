using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace AutoVideoMetaLocalize.Utilities {
	public class IntegerStore : IDictionary<string, int>  {
		private readonly Dictionary<string, int> dict = new Dictionary<string, int>();

		public int this[string key] { get => ((IDictionary<string, int>) dict)[key]; set => ((IDictionary<string, int>) dict)[key] = value; }

		public ICollection<string> Keys => ((IDictionary<string, int>) dict).Keys;

		public ICollection<int> Values => ((IDictionary<string, int>) dict).Values;

		public int Count => ((ICollection<KeyValuePair<string, int>>) dict).Count;

		public bool IsReadOnly => ((ICollection<KeyValuePair<string, int>>) dict).IsReadOnly;

		public void Add(string key, int value) {
			((IDictionary<string, int>) dict).Add(key, value);
		}

		public void Add(KeyValuePair<string, int> item) {
			((ICollection<KeyValuePair<string, int>>) dict).Add(item);
		}

		public void Clear() {
			((ICollection<KeyValuePair<string, int>>) dict).Clear();
		}

		public bool Contains(KeyValuePair<string, int> item) {
			return ((ICollection<KeyValuePair<string, int>>) dict).Contains(item);
		}

		public bool ContainsKey(string key) {
			return ((IDictionary<string, int>) dict).ContainsKey(key);
		}

		public void CopyTo(KeyValuePair<string, int>[] array, int arrayIndex) {
			((ICollection<KeyValuePair<string, int>>) dict).CopyTo(array, arrayIndex);
		}

		public IEnumerator<KeyValuePair<string, int>> GetEnumerator() {
			return ((IEnumerable<KeyValuePair<string, int>>) dict).GetEnumerator();
		}

		public bool Remove(string key) {
			return ((IDictionary<string, int>) dict).Remove(key);
		}

		public bool Remove(KeyValuePair<string, int> item) {
			return ((ICollection<KeyValuePair<string, int>>) dict).Remove(item);
		}

		public bool TryGetValue(string key, [MaybeNullWhen(false)] out int value) {
			return ((IDictionary<string, int>) dict).TryGetValue(key, out value);
		}

		IEnumerator IEnumerable.GetEnumerator() {
			return ((IEnumerable) dict).GetEnumerator();
		}
	}
}
