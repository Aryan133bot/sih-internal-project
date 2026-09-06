import 'package:flutter/material.dart';
import '../models/patient.dart';
import '../services/api_service.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final ApiService _apiService = ApiService();
  final _searchController = TextEditingController();
  List<Patient> _results = [];
  bool _isLoading = false;
  String? _error;

  void _search() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final results = await _apiService.getPatients(search: _searchController.text);
      if (mounted) {
        setState(() {
          _results = results;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Patients'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: const InputDecoration(
                      hintText: 'Name or Phone',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.search),
                    ),
                    onSubmitted: (_) => _search(),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _search,
                  child: const Text('Search'),
                ),
              ],
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text('Error: $_error'))
                    : _results.isEmpty
                        ? const Center(child: Text('No results found.'))
                        : ListView.builder(
                            itemCount: _results.length,
                            itemBuilder: (context, index) {
                              final p = _results[index];
                              return ListTile(
                                leading: CircleAvatar(child: Text(p.name[0])),
                                title: Text(p.name),
                                subtitle: Text('Phone: ${p.phone}'),
                                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                                onTap: () {
                                  Navigator.pushNamed(context, '/patient_detail', arguments: p);
                                },
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }
}
